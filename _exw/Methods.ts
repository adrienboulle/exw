import { RequestHandler } from 'express';

declare let Reflect: any;

export namespace METHODS {
  export const GET = 'GET';
  export const POST = 'POST';
  export const PUT = 'PUT';
  export const DELETE = 'DELETE';
  export const PATCH = 'PATCH';
  export const OPTIONS = 'OPTIONS';
  export const HEAD = 'HEAD';
  export const ALL = 'ALL';
}

type decoratorOptionsType = { route?: string, middlewares?: RequestHandler[] } | string;
type decoratorReturnType = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
type decoratorFunctionReturnType = (options?: decoratorOptionsType ) => decoratorReturnType;

function methodDecoratorFactory(method: string): decoratorFunctionReturnType {
  return (options: decoratorOptionsType) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    if (typeof options === 'string') {
      options = { route: <string> options };
    }

    Reflect.defineMetadata('handler', { ...options, method }, descriptor.value);
  };
}

export const Get: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.GET);
export const Post: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.POST);
export const Put: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.PUT);
export const Delete: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.DELETE);
export const Patch: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.PATCH);
export const Options: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.OPTIONS);
export const Head: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.HEAD);
export const All: decoratorFunctionReturnType = methodDecoratorFactory(METHODS.ALL);
