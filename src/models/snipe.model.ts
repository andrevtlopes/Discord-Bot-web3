import {
    Model,
    InferAttributes,
    InferCreationAttributes,
    CreationOptional,
    BelongsToGetAssociationMixin,
} from 'sequelize';
import { importantPartArray } from '../parts';
import { partialParts } from '../utils/types';
import User from './user.model';

interface Parts {
    handD: number;
    handR: number;
    handR1: number;
    eyesD: number;
    eyesR: number;
    eyesR1: number;
    hairD: number;
    hairR: number;
    hairR1: number;
    tailD: number;
    tailR: number;
    tailR1: number;
}

export default class Snipe extends Model<
    InferAttributes<Snipe>,
    InferCreationAttributes<Snipe>
> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare handD: CreationOptional<number>;
    declare handR: CreationOptional<number>;
    declare handR1: CreationOptional<number>;
    declare eyesD: CreationOptional<number>;
    declare eyesR: CreationOptional<number>;
    declare eyesR1: CreationOptional<number>;
    declare hairD: CreationOptional<number>;
    declare hairR: CreationOptional<number>;
    declare hairR1: CreationOptional<number>;
    declare tailD: CreationOptional<number>;
    declare tailR: CreationOptional<number>;
    declare tailR1: CreationOptional<number>;

    declare getUser: BelongsToGetAssociationMixin<User>;

    compareSnipeWithNinneko = (pet: any): boolean => {
        for (const part of partialParts) {
            if (
                (this as any)[part.name] !== null &&
                (this as any)[part.name] !== pet[part.name]
            ) {
                return false;
            }
        }
        return true;
    };
}
