import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    BelongsToGetAssociationMixin,
} from 'sequelize';
import User from './user.model';

export default class Selling extends Model<
    InferAttributes<Selling>,
    InferCreationAttributes<Selling>
> {
    declare id: CreationOptional<number>;
    declare ninnekoId: number;

    declare getUser: BelongsToGetAssociationMixin<User>;
}
