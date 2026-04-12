import { Transaction } from "sequelize";
import ManufacturingInfrastructure from "../models/ManufacturingInfrastructure";

type CreateManufacturingInfrastructureInput = {
    title: string;
    description?: string | null;
    points: string[];
};

type UpdateManufacturingInfrastructureInput = Partial<CreateManufacturingInfrastructureInput>;

const createManufacturingInfrastructure = async (
    data: CreateManufacturingInfrastructureInput,
    transaction: Transaction,
) => {
    return ManufacturingInfrastructure.create(data, { transaction });
};

const findAllManufacturingInfrastructures = async () => {
    return ManufacturingInfrastructure.findAll({ order: [["id", "ASC"]] });
};

const findManufacturingInfrastructureById = async (id: number, transaction?: Transaction) => {
    return ManufacturingInfrastructure.findByPk(id, { transaction });
};

const updateManufacturingInfrastructureById = async (
    id: number,
    updates: UpdateManufacturingInfrastructureInput,
    transaction: Transaction,
) => {
    return ManufacturingInfrastructure.update(updates, { where: { id }, transaction });
};

const deleteManufacturingInfrastructureById = async (id: number, transaction: Transaction) => {
    return ManufacturingInfrastructure.destroy({ where: { id }, transaction });
};

export default {
    createManufacturingInfrastructure,
    findAllManufacturingInfrastructures,
    findManufacturingInfrastructureById,
    updateManufacturingInfrastructureById,
    deleteManufacturingInfrastructureById,
};

