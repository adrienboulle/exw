"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var METHODS;
(function (METHODS) {
    METHODS.GET = 'GET';
    METHODS.POST = 'POST';
    METHODS.PUT = 'PUT';
    METHODS.DELETE = 'DELETE';
    METHODS.PATCH = 'PATCH';
    METHODS.OPTIONS = 'OPTIONS';
    METHODS.HEAD = 'HEAD';
    METHODS.ALL = 'ALL';
})(METHODS = exports.METHODS || (exports.METHODS = {}));
function methodDecoratorFactory(method) {
    return (options) => (target, propertyKey, descriptor) => {
        if (typeof options === 'string') {
            options = { route: options };
        }
        Reflect.defineMetadata('handler', Object.assign({}, options, { method }), descriptor.value);
    };
}
exports.Get = methodDecoratorFactory(METHODS.GET);
exports.Post = methodDecoratorFactory(METHODS.POST);
exports.Put = methodDecoratorFactory(METHODS.PUT);
exports.Delete = methodDecoratorFactory(METHODS.DELETE);
exports.Patch = methodDecoratorFactory(METHODS.PATCH);
exports.Options = methodDecoratorFactory(METHODS.OPTIONS);
exports.Head = methodDecoratorFactory(METHODS.HEAD);
exports.All = methodDecoratorFactory(METHODS.ALL);
