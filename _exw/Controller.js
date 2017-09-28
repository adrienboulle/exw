"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Controller(options) {
    return function (constructor) {
        Reflect.defineMetadata('controller', options, constructor);
    };
}
exports.Controller = Controller;
