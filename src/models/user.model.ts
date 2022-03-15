import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

// order of InferAttributes & InferCreationAttributes is important.
export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	declare id: CreationOptional<number>;
	declare publicAddress: string;
	declare username: CreationOptional<string>;
	declare subscriptionDue: CreationOptional<Date>;
	declare txID: CreationOptional<string>;
	declare discordID: string;

	isSubscribed(): boolean {
		const now = new Date();
		return this.subscriptionDue < now ? false : true;
	}
}
