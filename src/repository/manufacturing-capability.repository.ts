import { Transaction } from "sequelize";
import ManufacturingCapability from "../models/ManufacturingCapability";

type CreateManufacturingCapabilityInput = {
    title: string;
    description?: string | null;
    feature?: unknown;
    icon_name?: string | null;
    sort_order?: number | null;
    is_active?: boolean | null;
};

type UpdateManufacturingCapabilityInput = Partial<CreateManufacturingCapabilityInput> & {
    updated_at?: Date;
};

const createManufacturingCapability = async (
    data: CreateManufacturingCapabilityInput,
    transaction: Transaction,
) => {
    return ManufacturingCapability.create(data, { transaction });
};

const bulkCreateManufacturingCapabilities = async (
    data: CreateManufacturingCapabilityInput[],
    transaction: Transaction,
) => {
    return ManufacturingCapability.bulkCreate(data, { transaction });
};

const findManufacturingCapabilityById = async (id: number, transaction?: Transaction) => {
    return ManufacturingCapability.findByPk(id, { transaction });
};

const updateManufacturingCapabilityById = async (
    id: number,
    updates: UpdateManufacturingCapabilityInput,
    transaction: Transaction,
) => {
    return ManufacturingCapability.update(updates, { where: { id }, transaction });
};

const deleteManufacturingCapabilityById = async (id: number, transaction: Transaction) => {
    return ManufacturingCapability.destroy({ where: { id }, transaction });
};

const deleteAllManufacturingCapabilities = async (transaction: Transaction) => {
    return ManufacturingCapability.destroy({ where: {}, transaction });
};

const findAllManufacturingCapabilities = async () => {
    return ManufacturingCapability.findAll({ order: [["id", "ASC"]] });
};

export default {
    createManufacturingCapability,
    bulkCreateManufacturingCapabilities,
    findManufacturingCapabilityById,
    updateManufacturingCapabilityById,
    deleteManufacturingCapabilityById,
    deleteAllManufacturingCapabilities,
    findAllManufacturingCapabilities,
};
