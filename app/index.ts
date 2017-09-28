import 'reflect-metadata';

import { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import * as expressSession from 'express-session';
import * as cookieParser from 'cookie-parser';

import { SCOPES, Controller, Get, Put, bootstrap } from 'exw';

@Controller({
  route: '/session',
  scope: SCOPES.SESSION,
})
export class SessionScopedController {
  public n: number = 0;

  @Get()
  public main(req: Request, res: Response, next: NextFunction) {
    this.n++;
    res.send('HELLO WORLD ' + this.n);
  }
}

@Controller({
  route: '/singleton',
  scope: SCOPES.SINGLETON,
})
export class SingletonScopedController {
  public n: number = 0;

  @Get()
  public main(req: Request, res: Response, next: NextFunction) {
    this.n++;
    res.send('HELLO WORLD ' + this.n);
  }
}

@Controller({
  route: '/request',
  scope: SCOPES.REQUEST,
})
export class RequestScopedController {
  public n: number = 0;

  @Get()
  public main(req: Request, res: Response, next: NextFunction) {
    this.n++;
    res.send('HELLO WORLD ' + this.n);
  }
}

@Controller({
  route: '/api',
  middlewares: [
    (req, res, next) => {
      console.log(req.method, req.url, 'called');
      next();
    },
  ],
})
export class TestController {
  public mainValue: string = 'Value: api';
  public mainValuePost: string = ', Posted: ';
  public mainValuePut: string = 'PUT ? :scream: : ';

  @Get({
    middlewares: [
      (req, res, next) => {
        console.log('INSIDE MW 1');
        next();
      }
    ],
  })
  public main(req: Request, res: Response, next: NextFunction) {
    res.send(this.mainValue);
  }

  @Get({
    route: '/v2',
  })
  public api(req: Request, res: Response, next: NextFunction) {
    res.send('v2');
  }

  @Get('/v3')
  public post(req: Request, res: Response, next: NextFunction) {
    res.send('v3');
  }

  @Put()
  public put(req: Request, res: Response, next: NextFunction) {
    res.send(this.mainValuePut + JSON.stringify(req.body));
  }
}

bootstrap({
  port: 3000,
  controllers: [
    SessionScopedController,
    RequestScopedController,
    SingletonScopedController,
    TestController,
  ],
  middlewares: [
    bodyParser.json(),
    cookieParser(),
    expressSession({
      secret: 'super-secret',
      resave: true,
      saveUninitialized: true,
    }),
  ],
})
.then(() => {
  console.log('Running on port ' + 3000);
});
