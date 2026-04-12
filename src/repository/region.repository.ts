import { Transaction } from "sequelize";
import ExportRegion from "../models/ExportRegion";

type CreateRegionInput = {
    country_code: string;
    state_name: string;
};

const createRegion = async (data: CreateRegionInput, transaction: Transaction) => {
    return ExportRegion.create(data, { transaction });
};

const findAllRegions = async () => {
    return ExportRegion.findAll({ order: [["id", "ASC"]] });
};

const findRegionById = async (id: number, transaction?: Transaction) => {
    return ExportRegion.findByPk(id, { transaction });
};

const findRegionByCountryCode = async (country_code: string, transaction?: Transaction) => {
    return ExportRegion.findOne({
        where: { country_code },
        transaction,
    });
};

const deleteRegionById = async (id: number, transaction: Transaction) => {
    return ExportRegion.destroy({ where: { id }, transaction });
};

export default { createRegion, findAllRegions, findRegionById, findRegionByCountryCode, deleteRegionById };
