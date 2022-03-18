"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const user_model_1 = __importDefault(require("./models/user.model"));
const ninneko_model_1 = __importDefault(require("./models/ninneko.model"));
const saleHistory_model_1 = __importDefault(require("./models/saleHistory.model"));
const snipe_model_1 = __importDefault(require("./models/snipe.model"));
const sequelize = new sequelize_1.Sequelize('nps', '', undefined, {
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: true,
});
exports.sequelize = sequelize;
user_model_1.default.init({
    id: {
        type: sequelize_1.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    publicAddress: {
        allowNull: false,
        type: sequelize_1.STRING,
        unique: true,
        validate: { isLowercase: true },
    },
    username: {
        type: sequelize_1.STRING,
        unique: true,
    },
    subscriptionDue: {
        type: sequelize_1.DATE,
    },
    txID: {
        type: sequelize_1.STRING,
        unique: true,
    },
    discordID: {
        type: sequelize_1.STRING,
        unique: true,
    }
}, {
    tableName: 'users',
    sequelize,
    timestamps: false,
});
ninneko_model_1.default.init({
    id: {
        type: sequelize_1.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    createdAt: {
        type: sequelize_1.STRING,
        allowNull: false,
    },
    forSale: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    price: {
        type: sequelize_1.BIGINT,
        allowNull: false,
    },
    class: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    breedCount: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    generation: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    faction: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    factionColor: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    eyesD: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    eyesR: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    eyesR1: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    mouthD: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    mouthR: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    mouthR1: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    hairD: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    hairR: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    hairR1: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    handD: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    handR: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    handR1: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    earsD: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    earsR: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    earsR1: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    tailD: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    tailR: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    },
    tailR1: {
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    }
}, {
    tableName: 'ninnekos',
    sequelize,
});
saleHistory_model_1.default.init({
    createdAt: {
        allowNull: false,
        type: sequelize_1.STRING,
    },
    price: {
        allowNull: false,
        type: sequelize_1.BIGINT,
    },
}, {
    tableName: 'saleHistory',
    sequelize,
});
snipe_model_1.default.init({
    id: {
        type: sequelize_1.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: sequelize_1.STRING,
        allowNull: false,
        unique: true,
    },
    eyesD: sequelize_1.INTEGER.UNSIGNED,
    eyesR: sequelize_1.INTEGER.UNSIGNED,
    eyesR1: sequelize_1.INTEGER.UNSIGNED,
    hairD: sequelize_1.INTEGER.UNSIGNED,
    hairR: sequelize_1.INTEGER.UNSIGNED,
    hairR1: sequelize_1.INTEGER.UNSIGNED,
    handD: sequelize_1.INTEGER.UNSIGNED,
    handR: sequelize_1.INTEGER.UNSIGNED,
    handR1: sequelize_1.INTEGER.UNSIGNED,
    tailD: sequelize_1.INTEGER.UNSIGNED,
    tailR: sequelize_1.INTEGER.UNSIGNED,
    tailR1: sequelize_1.INTEGER.UNSIGNED,
}, {
    tableName: 'snipes',
    sequelize,
});
ninneko_model_1.default.hasMany(saleHistory_model_1.default);
user_model_1.default.hasMany(snipe_model_1.default);
snipe_model_1.default.belongsTo(user_model_1.default);
