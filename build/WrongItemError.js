"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WrongItemError extends Error {
    constructor(item) {
        super('Wrong Item: ' + item);
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = 'WrongItemError';
        this.item = item;
    }
}
exports.default = WrongItemError;
