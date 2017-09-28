import { Application, Request, Response, NextFunction, RequestHandler, Router } from 'express';
import * as express from 'express';

import { SCOPES } from './Scopes';

const ctrlMap = new Map<Function, Function>();
const sessionsMap = new Map<string, Map<Function, any>>();

declare const Reflect: any;

function handlerFactory(controller: any, protoName: string): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const ctrl = ctrlMap.get(controller)(req, controller);

    ctrl[protoName].bind(ctrl)(req, res, next);
  }
}

function getControllerFactory(controller: any, controllerOptions: any): Function {
  switch (controllerOptions.scope) {
    case SCOPES.REQUEST: {
      return (req: Request, controller: any) => new controller();
    }

    case SCOPES.SESSION: {
      return (req: Request, controller: any) => {
        let sessionInstances = sessionsMap.get(req.sessionID);

        if (!sessionInstances) {
          sessionInstances = new Map<Function, any>();
          sessionsMap.set(req.sessionID, sessionInstances);
        }

        let instance = sessionInstances.get(controller);

        if (!instance) {
          instance = new controller();
          sessionInstances.set(controller, instance);
        }

        return instance;
      };
    }

    case SCOPES.SINGLETON:
    default: {
      let instance: any = null;

      return (req: Request, controller: any) => instance = instance || new controller();
    }
  }
}

export function bootstrap({ port, controllers, middlewares}: { port: number, controllers: any[], middlewares?: any[]}): Promise<void> {
  return new Promise((res, rej) => {
    const app: Application = express();

    for (let middleware of middlewares || []) {
      app.use(middleware);
    }

    for (let controller of controllers) {
      const controllerOptions = Reflect.getMetadata('controller', controller);
      ctrlMap.set(controller, getControllerFactory(controller, controllerOptions));
      const router = Router();

      for (let middleware of controllerOptions.middlewares || []) {
        router.use(middleware);
      }

      Object.getOwnPropertyNames(controller.prototype).forEach(proto => {
        const handlerOptions = Reflect.getMetadata('handler', controller.prototype[proto]);

        if (!handlerOptions) {
          return;
        }

        return router[handlerOptions.method.toLowerCase()].apply(router, [handlerOptions.route || '/', ...handlerOptions.middlewares || [], handlerFactory(controller, proto)]);
      });

      app.use(controllerOptions.route, router);
    }

    app.listen(port, res);
  })
}
