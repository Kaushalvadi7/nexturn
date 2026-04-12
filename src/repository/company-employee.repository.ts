import { Op, Transaction } from "sequelize";
import CompanyEmployee from "../models/CompanyEmployee";
import Image from "../models/Image";

type CreateCompanyEmployeeInput = {
    name: string;
    role: string;
    education?: string | null;
    experience?: string | null;
};

type UpdateCompanyEmployeeInput = Partial<CreateCompanyEmployeeInput> & {
    updated_at?: Date;
};

type CreateImageInput = {
    entity_type: "company_employee";
    entity_id: number;
    image_url: string;
    public_id?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

const createCompanyEmployee = async (data: CreateCompanyEmployeeInput, transaction: Transaction) => {
    return CompanyEmployee.create(data, { transaction });
};

const findAllCompanyEmployees = async () => {
    return CompanyEmployee.findAll({ order: [["id", "ASC"]] });
};

const findCompanyEmployeeById = async (id: number, transaction?: Transaction) => {
    return CompanyEmployee.findByPk(id, { transaction });
};

const updateCompanyEmployeeById = async (
    id: number,
    updates: UpdateCompanyEmployeeInput,
    transaction: Transaction,
) => {
    return CompanyEmployee.update(updates, { where: { id }, transaction });
};

const deleteCompanyEmployeeById = async (id: number, transaction: Transaction) => {
    return CompanyEmployee.destroy({ where: { id }, transaction });
};

const findImagesByEmployeeId = async (employeeId: number, transaction: Transaction) => {
    return Image.findAll({
        where: { entity_type: "company_employee", entity_id: employeeId },
        order: [
            ["is_primary", "DESC"],
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
        transaction,
    });
};

const findImagesByEmployeeIds = async (employeeIds: number[]) => {
    if (employeeIds.length === 0) return [];
    return Image.findAll({
        where: { entity_type: "company_employee", entity_id: { [Op.in]: employeeIds } },
        order: [
            ["is_primary", "DESC"],
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const deleteImagesByEmployeeId = async (employeeId: number, transaction: Transaction) => {
    return Image.destroy({ where: { entity_type: "company_employee", entity_id: employeeId }, transaction });
};

const bulkCreateImages = async (data: CreateImageInput[], transaction: Transaction) => {
    if (data.length === 0) return [];
    return Image.bulkCreate(data, { transaction });
};

export default {
    createCompanyEmployee,
    findAllCompanyEmployees,
    findCompanyEmployeeById,
    updateCompanyEmployeeById,
    deleteCompanyEmployeeById,
    findImagesByEmployeeId,
    findImagesByEmployeeIds,
    deleteImagesByEmployeeId,
    bulkCreateImages,
};

