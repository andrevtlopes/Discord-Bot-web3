import { Model, InferAttributes, InferCreationAttributes } from 'sequelize';
import SaleHistory from './saleHistory.model';

export default class Ninneko extends Model<InferAttributes<Ninneko>, InferCreationAttributes<Ninneko>> {
	declare id: number;
	declare createdAt: string;
	declare forSale: number;
	declare price: number;
    declare class: number;
    declare breedCount: number;
    declare generation: number;
    declare faction: number;
    declare factionColor: number;
    declare eyesD: number;
    declare eyesR: number;
    declare eyesR1: number;
    declare mouthD: number;
    declare mouthR: number;
    declare mouthR1: number;
    declare hairD: number;
    declare hairR: number;
    declare hairR1: number;
    declare handD: number;
    declare handR: number;
    declare handR1: number;
    declare earsD: number;
    declare earsR: number;
    declare earsR1: number;
    declare tailD: number;
    declare tailR: number;
    declare tailR1: number;
}