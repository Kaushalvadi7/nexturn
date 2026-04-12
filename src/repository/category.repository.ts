import { Op, Transaction } from "sequelize";
import Category from "../models/Category";
import Image from "../models/Image";
import MaterialGrade from "../models/MaterialGrade";

type CreateCategoryInput = {
    name: string;
    description?: string | null;
    process?: string | null;
    surface_finish?: string | null;
    applications?: unknown;
};

type UpdateCategoryInput = Partial<CreateCategoryInput> & {
    updated_at?: Date;
};

type CreateMaterialGradeInput = {
    entity_type: "category";
    entity_id: number;
    grade: string;
    standard?: string | null;
    notes?: string | null;
    sort_order?: number;
};

type CreateImageInput = {
    entity_type: "category";
    entity_id: number;
    image_url: string;
    public_id?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

const createCategory = async (data: CreateCategoryInput, transaction: Transaction) => {
    return Category.create(data, { transaction });
};

const findAllCategories = async () => {
    return Category.findAll({
        order: [
            ["sort_order", "ASC"],
            ["created_at", "DESC"],
        ],
    });
};

const findCategoryById = async (id: number, transaction?: Transaction) => {
    return Category.findByPk(id, { transaction });
};

const updateCategoryById = async (
    categoryId: number,
    data: UpdateCategoryInput,
    transaction: Transaction,
) => {
    return Category.update(data, { where: { id: categoryId }, transaction });
};

const findImagesByCategoryId = async (categoryId: number, transaction: Transaction) => {
    return Image.findAll({
        where: { entity_type: "category", entity_id: categoryId },
        transaction,
    });
};

const findImagesByCategoryIdAndUrls = async (
    categoryId: number,
    imageUrls: string[],
    transaction: Transaction,
) => {
    return Image.findAll({
        where: { entity_type: "category", entity_id: categoryId, image_url: imageUrls },
        transaction,
    });
};

const findImagesByCategoryIds = async (categoryIds: number[]) => {
    if (categoryIds.length === 0) {
        return [];
    }
    return Image.findAll({
        where: { entity_type: "category", entity_id: { [Op.in]: categoryIds } },
        order: [
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const findMaterialGradesByCategoryIds = async (categoryIds: number[]) => {
    if (categoryIds.length === 0) {
        return [];
    }
    return MaterialGrade.findAll({
        where: { entity_type: "category", entity_id: { [Op.in]: categoryIds } },
        order: [
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const deleteImagesByCategoryUrls = async (
    categoryId: number,
    imageUrls: string[],
    transaction: Transaction,
) => {
    if (imageUrls.length === 0) {
        return 0;
    }
    return Image.destroy({
        where: { entity_type: "category", entity_id: categoryId, image_url: imageUrls },
        transaction,
    });
};

const deleteImagesByCategoryId = async (categoryId: number, transaction: Transaction) => {
    return Image.destroy({
        where: { entity_type: "category", entity_id: categoryId },
        transaction,
    });
};

const deleteMaterialGradesByCategoryId = async (categoryId: number, transaction: Transaction) => {
    return MaterialGrade.destroy({
        where: { entity_type: "category", entity_id: categoryId },
        transaction,
    });
};

const deleteCategoryById = async (categoryId: number, transaction: Transaction) => {
    return Category.destroy({ where: { id: categoryId }, transaction });
};

const bulkCreateMaterialGrades = async (
    data: CreateMaterialGradeInput[],
    transaction: Transaction,
) => {
    if (data.length === 0) {
        return [];
    }
    return MaterialGrade.bulkCreate(data, { transaction });
};

const bulkCreateImages = async (data: CreateImageInput[], transaction: Transaction) => {
    if (data.length === 0) {
        return [];
    }
    return Image.bulkCreate(data, { transaction });
};

export default {
    createCategory,
    findAllCategories,
    findCategoryById,
    updateCategoryById,
    findImagesByCategoryId,
    findImagesByCategoryIdAndUrls,
    findImagesByCategoryIds,
    findMaterialGradesByCategoryIds,
    deleteImagesByCategoryId,
    deleteImagesByCategoryUrls,
    deleteMaterialGradesByCategoryId,
    deleteCategoryById,
    bulkCreateMaterialGrades,
    bulkCreateImages,
};
