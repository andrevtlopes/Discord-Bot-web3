"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const models_1 = require("./models");
const sequelize = new sequelize_1.Sequelize('nps', '', undefined, {
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: true,
});
exports.sequelize = sequelize;
// Init all models
models_1.User.init({
    nonce: {
        allowNull: false,
        type: sequelize_1.INTEGER.UNSIGNED,
        defaultValue: () => Math.floor(Math.random() * 10000), // Initialize with a random nonce
    },
    publicAddress: {
        allowNull: false,
        type: sequelize_1.STRING,
        unique: true,
        validate: { isLowercase: true },
    },
    privateKey: {
        allowNull: false,
        type: sequelize_1.STRING,
        unique: true,
    },
    publicKey: {
        allowNull: false,
        type: sequelize_1.STRING,
        unique: true,
    },
    username: {
        type: sequelize_1.STRING,
        unique: true,
    },
}, {
    modelName: 'user',
    sequelize,
    timestamps: false,
});
// Create new tables
sequelize.sync();
