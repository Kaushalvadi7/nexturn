import { Transaction } from "sequelize";
import InspectionEquipment from "../models/InspectionEquipment";

type CreateInspectionEquipmentInput = {
    title: string;
    icon_name?: string | null;
    measurement: string;
    accuracy: string;
    application: string[];
};

type UpdateInspectionEquipmentInput = Partial<CreateInspectionEquipmentInput> & {
    updated_at?: Date;
};

const createInspectionEquipment = async (data: CreateInspectionEquipmentInput, transaction: Transaction) => {
    return InspectionEquipment.create(data, { transaction });
};

const findAllInspectionEquipment = async () => {
    return InspectionEquipment.findAll({ order: [["id", "ASC"]] });
};

const findInspectionEquipmentById = async (id: number, transaction?: Transaction) => {
    return InspectionEquipment.findByPk(id, { transaction });
};

const updateInspectionEquipmentById = async (
    id: number,
    updates: UpdateInspectionEquipmentInput,
    transaction: Transaction,
) => {
    return InspectionEquipment.update(updates, { where: { id }, transaction });
};

const deleteInspectionEquipmentById = async (id: number, transaction: Transaction) => {
    return InspectionEquipment.destroy({ where: { id }, transaction });
};

export default {
    createInspectionEquipment,
    findAllInspectionEquipment,
    findInspectionEquipmentById,
    updateInspectionEquipmentById,
    deleteInspectionEquipmentById,
};

