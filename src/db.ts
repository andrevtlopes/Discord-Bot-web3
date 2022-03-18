import { BIGINT, DATE, INTEGER, Sequelize, STRING } from 'sequelize';

import User from './models/user.model';
import Ninneko from './models/ninneko.model';
import SaleHistory from './models/saleHistory.model';
import Snipe from './models/snipe.model';

const sequelize = new Sequelize('nps', '', undefined, {
	dialect: 'sqlite',
	storage: './db.sqlite',
	logging: true,
});

// Init all models
User.init(
	{
		id: {
			type: INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		publicAddress: {
			allowNull: false,
			type: STRING,
			unique: true,
			validate: { isLowercase: true },
		},
		username: {
			type: STRING,
			unique: true,
		},
		subscriptionDue: {
			type: DATE,
		},
		txID: {
			type: STRING,
			unique: true,
		},
		discordID: {
			type: STRING,
			unique: true,
		}
	},
	{
		tableName: 'users',
		sequelize,
		timestamps: false,
	}
);

Ninneko.init(
	{
		id: {
			type: INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		createdAt: {
			type: STRING,
			allowNull: false,
		},
		forSale: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		price: {
			type: BIGINT,
			allowNull: false,
		},
		class: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		breedCount: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		generation: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		faction: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		factionColor: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		eyesD: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		eyesR: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		eyesR1: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		mouthD: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		mouthR: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		mouthR1: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		hairD: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		hairR: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		hairR1: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		handD: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		handR: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		handR1: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		earsD: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		earsR: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		earsR1: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		tailD: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		tailR: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		tailR1: {
			type: INTEGER.UNSIGNED,
			allowNull: false,
		},
		soldAt: {
			type: DATE,
			allowNull: true,
		},
		soldPrice: {
			type: BIGINT,
			allowNull: true,
		}
	},
	{
		tableName: 'ninnekos',
		sequelize,
	}
);

SaleHistory.init(
	{
		createdAt: {
			allowNull: false,
			type: STRING,
		},
		price: {
			allowNull: false,
			type: BIGINT,
		},
		
	},
	{
		tableName: 'saleHistory',
		sequelize,
	}
);

Snipe.init(
	{
		id: {
			type: INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: STRING,
			allowNull: false,
			unique: true,
		},
		eyesD: INTEGER.UNSIGNED,
		eyesR: INTEGER.UNSIGNED,
		eyesR1: INTEGER.UNSIGNED,
		hairD: INTEGER.UNSIGNED,
		hairR: INTEGER.UNSIGNED,
		hairR1: INTEGER.UNSIGNED,
		handD: INTEGER.UNSIGNED,
		handR: INTEGER.UNSIGNED,
		handR1: INTEGER.UNSIGNED,
		tailD: INTEGER.UNSIGNED,
		tailR: INTEGER.UNSIGNED,
		tailR1: INTEGER.UNSIGNED,
	},
	{
		tableName: 'snipes',
		sequelize,
	}
);

Ninneko.hasMany(SaleHistory);
User.hasMany(Snipe);
Snipe.belongsTo(User);

sequelize.sync();

export { sequelize };
