"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const exw_1 = require("exw");
let SessionScopedController = class SessionScopedController {
    constructor() {
        this.n = 0;
    }
    main(req, res, next) {
        this.n++;
        res.send('HELLO WORLD ' + this.n);
    }
};
__decorate([
    exw_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], SessionScopedController.prototype, "main", null);
SessionScopedController = __decorate([
    exw_1.Controller({
        route: '/session',
        scope: exw_1.SCOPES.SESSION,
    })
], SessionScopedController);
exports.SessionScopedController = SessionScopedController;
let SingletonScopedController = class SingletonScopedController {
    constructor() {
        this.n = 0;
    }
    main(req, res, next) {
        this.n++;
        res.send('HELLO WORLD ' + this.n);
    }
};
__decorate([
    exw_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], SingletonScopedController.prototype, "main", null);
SingletonScopedController = __decorate([
    exw_1.Controller({
        route: '/singleton',
        scope: exw_1.SCOPES.SINGLETON,
    })
], SingletonScopedController);
exports.SingletonScopedController = SingletonScopedController;
let RequestScopedController = class RequestScopedController {
    constructor() {
        this.n = 0;
    }
    main(req, res, next) {
        this.n++;
        res.send('HELLO WORLD ' + this.n);
    }
    post(req, res, next) {
        console.log(req.body);
        res.send('HELLO WORLD ' + this.n);
    }
};
__decorate([
    exw_1.Get(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], RequestScopedController.prototype, "main", null);
__decorate([
    exw_1.Post(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], RequestScopedController.prototype, "post", null);
RequestScopedController = __decorate([
    exw_1.Controller({
        route: '/request',
        scope: exw_1.SCOPES.REQUEST,
    })
], RequestScopedController);
exports.RequestScopedController = RequestScopedController;
let TestController = class TestController {
    constructor() {
        this.mainValue = 'Value: api';
        this.mainValuePost = ', Posted: ';
        this.mainValuePut = 'PUT ? :scream: : ';
    }
    main(req, res, next) {
        res.send(this.mainValue);
    }
    api(req, res, next) {
        res.send('v2');
    }
    post(req, res, next) {
        res.send('v3');
    }
    put(req, res, next) {
        res.send(this.mainValuePut + JSON.stringify(req.body));
    }
};
__decorate([
    exw_1.Get({
        middlewares: [
            (req, res, next) => {
                console.log('INSIDE MW 1');
                next();
            }
        ],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], TestController.prototype, "main", null);
__decorate([
    exw_1.Get({
        route: '/v2',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], TestController.prototype, "api", null);
__decorate([
    exw_1.Get('/v3'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], TestController.prototype, "post", null);
__decorate([
    exw_1.Put(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], TestController.prototype, "put", null);
TestController = __decorate([
    exw_1.Controller({
        route: '/api',
        middlewares: [
            (req, res, next) => {
                console.log(req.method, req.url, 'called');
                next();
            },
        ],
    })
], TestController);
exports.TestController = TestController;
exw_1.bootstrap({
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
