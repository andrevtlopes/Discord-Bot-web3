"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
    isSubscribed() {
        const now = new Date();
        return this.subscriptionDue < now ? false : true;
    }
}
exports.default = User;
