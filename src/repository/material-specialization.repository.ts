import { Transaction } from "sequelize";
import MaterialSpecialization from "../models/MaterialSpecialization";

type CreateMaterialSpecializationInput = {
    image_url?: string | null;
    public_url?: string | null;
    title: string;
    description?: string | null;
    grades?: string[] | null;
    common_application?: string[] | null;
};

const createMaterialSpecialization = async (
    data: CreateMaterialSpecializationInput,
    transaction: Transaction,
) => {
    return MaterialSpecialization.create(data, { transaction });
};

const bulkCreateMaterialSpecializations = async (
    data: CreateMaterialSpecializationInput[],
    transaction: Transaction,
) => {
    return MaterialSpecialization.bulkCreate(data, { transaction });
};

const findAllMaterialSpecializations = async () => {
    return MaterialSpecialization.findAll({ order: [["id", "ASC"]] });
};

const findMaterialSpecializationById = async (id: number, transaction?: Transaction) => {
    return MaterialSpecialization.findByPk(id, { transaction });
};

const updateMaterialSpecializationById = async (
    id: number,
    data: Partial<CreateMaterialSpecializationInput>,
    transaction: Transaction,
) => {
    return MaterialSpecialization.update(data, { where: { id }, transaction });
};

const deleteMaterialSpecializationById = async (id: number, transaction: Transaction) => {
    return MaterialSpecialization.destroy({ where: { id }, transaction });
};

const deleteAllMaterialSpecializations = async (transaction: Transaction) => {
    return MaterialSpecialization.destroy({ where: {}, transaction });
};

export default {
    createMaterialSpecialization,
    bulkCreateMaterialSpecializations,
    findAllMaterialSpecializations,
    findMaterialSpecializationById,
    updateMaterialSpecializationById,
    deleteMaterialSpecializationById,
    deleteAllMaterialSpecializations,
};
