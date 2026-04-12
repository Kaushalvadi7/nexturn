import { Op, Transaction } from "sequelize";
import Product from "../models/Product";
import Image from "../models/Image";
import MaterialGrade from "../models/MaterialGrade";
import Category from "../models/Category";

type CreateProductInput = {
    category_id?: number | null;
    name: string;
    description?: string | null;
    applications?: unknown;
    specifications?: unknown;
};

type UpdateProductInput = Partial<CreateProductInput> & {
    updated_at?: Date;
};

type CreateMaterialGradeInput = {
    entity_type: "product";
    entity_id: number;
    grade: string;
    standard?: string | null;
    notes?: string | null;
    sort_order?: number;
};

type CreateImageInput = {
    entity_type: "product";
    entity_id: number;
    image_url: string;
    public_id?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

const createProduct = async (data: CreateProductInput, transaction: Transaction) => {
    return Product.create(data, { transaction });
};

const findAllProducts = async () => {
    return Product.findAll({
        include: [{ model: Category, attributes: ["id", "name"] }],
        order: [
            ["sort_order", "ASC"],
            ["created_at", "DESC"],
        ],
    });
};

const findProductById = async (id: number, transaction?: Transaction) => {
    return Product.findByPk(id, { transaction });
};

const updateProductById = async (
    productId: number,
    data: UpdateProductInput,
    transaction: Transaction,
) => {
    return Product.update(data, { where: { id: productId }, transaction });
};

const findImagesByProductId = async (productId: number, transaction: Transaction) => {
    return Image.findAll({
        where: { entity_type: "product", entity_id: productId },
        transaction,
    });
};

const findImagesByProductIdAndUrls = async (
    productId: number,
    imageUrls: string[],
    transaction: Transaction,
) => {
    return Image.findAll({
        where: { entity_type: "product", entity_id: productId, image_url: imageUrls },
        transaction,
    });
};

const findImagesByProductIds = async (productIds: number[]) => {
    if (productIds.length === 0) {
        return [];
    }
    return Image.findAll({
        where: { entity_type: "product", entity_id: { [Op.in]: productIds } },
        order: [
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const findMaterialGradesByProductIds = async (productIds: number[]) => {
    if (productIds.length === 0) {
        return [];
    }
    return MaterialGrade.findAll({
        where: { entity_type: "product", entity_id: { [Op.in]: productIds } },
        order: [
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const deleteImagesByProductUrls = async (
    productId: number,
    imageUrls: string[],
    transaction: Transaction,
) => {
    if (imageUrls.length === 0) {
        return 0;
    }
    return Image.destroy({
        where: { entity_type: "product", entity_id: productId, image_url: imageUrls },
        transaction,
    });
};

const deleteImagesByProductId = async (productId: number, transaction: Transaction) => {
    return Image.destroy({
        where: { entity_type: "product", entity_id: productId },
        transaction,
    });
};

const deleteMaterialGradesByProductId = async (productId: number, transaction: Transaction) => {
    return MaterialGrade.destroy({
        where: { entity_type: "product", entity_id: productId },
        transaction,
    });
};

const deleteProductById = async (productId: number, transaction: Transaction) => {
    return Product.destroy({ where: { id: productId }, transaction });
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
    createProduct,
    findAllProducts,
    findProductById,
    updateProductById,
    findImagesByProductId,
    findImagesByProductIdAndUrls,
    findImagesByProductIds,
    findMaterialGradesByProductIds,
    deleteImagesByProductId,
    deleteImagesByProductUrls,
    deleteMaterialGradesByProductId,
    deleteProductById,
    bulkCreateMaterialGrades,
    bulkCreateImages,
};
