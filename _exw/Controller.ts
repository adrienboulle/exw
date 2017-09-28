import { RequestHandler } from 'express';

declare const Reflect: any;

export function Controller(options: { route: string, scope?: string, middlewares?: RequestHandler[] }) {
  return function (constructor: Function) {
    Reflect.defineMetadata('controller', options, constructor);
  }
}
