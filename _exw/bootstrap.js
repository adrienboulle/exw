"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express = require("express");
const Scopes_1 = require("./Scopes");
const ctrlMap = new Map();
const sessionsMap = new Map();
function handlerFactory(controller, protoName) {
    return (req, res, next) => {
        const ctrl = ctrlMap.get(controller)(req, controller);
        ctrl[protoName].bind(ctrl)(req, res, next);
    };
}
function getControllerFactory(controller, controllerOptions) {
    switch (controllerOptions.scope) {
        case Scopes_1.SCOPES.REQUEST: {
            return (req, controller) => new controller();
        }
        case Scopes_1.SCOPES.SESSION: {
            return (req, controller) => {
                let sessionInstances = sessionsMap.get(req.sessionID);
                if (!sessionInstances) {
                    sessionInstances = new Map();
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
        case Scopes_1.SCOPES.SINGLETON:
        default: {
            let instance = null;
            return (req, controller) => instance = instance || new controller();
        }
    }
}
function bootstrap({ port, controllers, middlewares }) {
    return new Promise((res, rej) => {
        const app = express();
        for (let middleware of middlewares || []) {
            app.use(middleware);
        }
        for (let controller of controllers) {
            const controllerOptions = Reflect.getMetadata('controller', controller);
            ctrlMap.set(controller, getControllerFactory(controller, controllerOptions));
            const router = express_1.Router();
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
    });
}
exports.bootstrap = bootstrap;
