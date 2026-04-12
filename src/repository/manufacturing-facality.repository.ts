import { Op, Transaction } from "sequelize";
import ManufacturingFacality from "../models/ManufacturingFacality";
import Image from "../models/Image";

type CreateManufacturingFacalityInput = {
    title: string;
    description?: string | null;
};

type UpdateManufacturingFacalityInput = Partial<CreateManufacturingFacalityInput> & {
    updated_at?: Date;
};

type CreateImageInput = {
    entity_type: "manufacturing_facality";
    entity_id: number;
    image_url: string;
    public_id?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

const createManufacturingFacality = async (
    data: CreateManufacturingFacalityInput,
    transaction: Transaction,
) => {
    return ManufacturingFacality.create(data, { transaction });
};

const findAllManufacturingFacalities = async () => {
    return ManufacturingFacality.findAll({ order: [["id", "ASC"]] });
};

const findManufacturingFacalityById = async (id: number, transaction?: Transaction) => {
    return ManufacturingFacality.findByPk(id, { transaction });
};

const updateManufacturingFacalityById = async (
    id: number,
    updates: UpdateManufacturingFacalityInput,
    transaction: Transaction,
) => {
    return ManufacturingFacality.update(updates, { where: { id }, transaction });
};

const deleteManufacturingFacalityById = async (id: number, transaction: Transaction) => {
    return ManufacturingFacality.destroy({ where: { id }, transaction });
};

const findImagesByFacalityId = async (facalityId: number, transaction: Transaction) => {
    return Image.findAll({
        where: { entity_type: "manufacturing_facality", entity_id: facalityId },
        order: [
            ["is_primary", "DESC"],
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
        transaction,
    });
};

const findImagesByFacalityIds = async (facalityIds: number[]) => {
    if (facalityIds.length === 0) return [];
    return Image.findAll({
        where: { entity_type: "manufacturing_facality", entity_id: { [Op.in]: facalityIds } },
        order: [
            ["is_primary", "DESC"],
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const deleteImagesByFacalityId = async (facalityId: number, transaction: Transaction) => {
    return Image.destroy({
        where: { entity_type: "manufacturing_facality", entity_id: facalityId },
        transaction,
    });
};

const bulkCreateImages = async (data: CreateImageInput[], transaction: Transaction) => {
    if (data.length === 0) return [];
    return Image.bulkCreate(data, { transaction });
};

export default {
    createManufacturingFacality,
    findAllManufacturingFacalities,
    findManufacturingFacalityById,
    updateManufacturingFacalityById,
    deleteManufacturingFacalityById,
    findImagesByFacalityId,
    findImagesByFacalityIds,
    deleteImagesByFacalityId,
    bulkCreateImages,
};

