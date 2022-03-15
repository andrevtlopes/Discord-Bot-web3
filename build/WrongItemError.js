"use strict";
class WrongItemError extends Error {
    constructor(item) {
        super('Wrong Item: ' + item);
        this.name = 'WrongItemError';
        this.item = item;
    }
}
