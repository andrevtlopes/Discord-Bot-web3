export default class WrongItemError extends Error {
    declare item: string;

    constructor(item: string) {
        super('Wrong Item: ' + item);

        const actualProto = new.target.prototype;

        if (Object.setPrototypeOf) { Object.setPrototypeOf(this, actualProto); } 
        else { (this as any).__proto__ = actualProto; } 

        this.name = 'WrongItemError';
        this.item = item;
    }
}