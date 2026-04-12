import { Transaction } from "sequelize";
import InfoTable from "../models/PerformanceMetrices";

type CreateInfoTableInput = {
    field: string;
    value: string;
    icon_name?: string | null;
    view_in_hero_page?: boolean;
    view_in_about_us?: boolean;
};

type UpdateInfoTableInput = Partial<CreateInfoTableInput> & { updated_at?: Date };

const createInfoTable = async (data: CreateInfoTableInput, transaction: Transaction) => {
    return InfoTable.create(data, { transaction });
};

const findAllInfoTable = async () => {
    return InfoTable.findAll({ order: [["id", "ASC"]] });
};

const findInfoTableById = async (id: number, transaction?: Transaction) => {
    return InfoTable.findByPk(id, { transaction });
};

const updateInfoTableById = async (id: number, data: UpdateInfoTableInput, transaction: Transaction) => {
    return InfoTable.update(data, { where: { id }, transaction });
};

const deleteInfoTableById = async (id: number, transaction: Transaction) => {
    return InfoTable.destroy({ where: { id }, transaction });
};

export default {
    createInfoTable,
    findAllInfoTable,
    findInfoTableById,
    updateInfoTableById,
    deleteInfoTableById,
};
