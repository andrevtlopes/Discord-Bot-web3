import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';

export default class SaleHistory extends Model<InferAttributes<SaleHistory>, InferCreationAttributes<SaleHistory>> {
    declare createdAt: string;
    declare price: number;
}