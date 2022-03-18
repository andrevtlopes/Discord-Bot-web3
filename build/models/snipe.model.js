"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const types_1 = require("../utils/types");
class Snipe extends sequelize_1.Model {
    constructor() {
        super(...arguments);
        this.compareSnipeWithNinneko = (pet) => {
            for (const part of types_1.partialParts) {
                if (this[part.name] !== null &&
                    this[part.name] !== pet[part.name]) {
                    return false;
                }
            }
            return true;
        };
    }
}
exports.default = Snipe;
