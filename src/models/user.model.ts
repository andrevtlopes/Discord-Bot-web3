import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    HasManyGetAssociationsMixin,
    HasManyCountAssociationsMixin,
    HasManyCreateAssociationMixin,
    HasManyRemoveAssociationMixin,
} from 'sequelize';
import Selling from './selling.model';
import Snipe from './snipe.model';

// order of InferAttributes & InferCreationAttributes is important.
export default class User extends Model<
    InferAttributes<User>,
    InferCreationAttributes<User>
> {
    declare id: CreationOptional<number>;
    declare publicAddress: string;
    declare username: CreationOptional<string>;
    declare subscriptionDue: CreationOptional<Date>;
    declare txID: CreationOptional<string>;
    declare discordID: string;

    declare getSnipes: HasManyGetAssociationsMixin<Snipe>;
    declare createSnipe: HasManyCreateAssociationMixin<Snipe>;
    declare removeSnipe: HasManyRemoveAssociationMixin<Snipe, number>;
    declare countSnipes: HasManyCountAssociationsMixin;

    declare getSellings: HasManyGetAssociationsMixin<Selling>;
    declare createSelling: HasManyCreateAssociationMixin<Selling>;
    declare removeSelling: HasManyRemoveAssociationMixin<Selling, number>;
    declare countSellings: HasManyCountAssociationsMixin;

    isSubscribed(): boolean {
        const now = new Date();
        return this.subscriptionDue < now ? false : true;
    }
}
