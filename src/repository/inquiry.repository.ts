import { Op, Transaction } from "sequelize";
import Inquiry from "../models/Inquiry";
import Image from "../models/Image";

type CreateInquiryInput = {
    full_name: string;
    email: string;
    phone?: string | null;
    company_name?: string | null;
    category_name?: string | null;
    subject?: string | null;
    message: string;
    status?: string | null;
    is_viewed?: boolean | null;
    created_at: Date;

};

type UpdateInquiryInput = Partial<CreateInquiryInput> & {
    status?: string | null;
    is_viewed?: boolean | null;
};

type CreateImageInput = {
    entity_type: "inquiry";
    entity_id: number;
    image_url: string;
    public_id?: string | null;
    is_primary?: boolean;
    sort_order?: number;
};

const createInquiry = async (data: CreateInquiryInput, transaction: Transaction) => {
    return Inquiry.create(data, { transaction });
};

const findAllInquiries = async () => {
    return Inquiry.findAll({
        order: [
            ["created_at", "DESC"],
            ["id", "DESC"],
        ],
    });
};

const findInquiryById = async (id: number, transaction?: Transaction) => {
    return Inquiry.findByPk(id, { transaction });
};

const updateInquiryById = async (
    inquiryId: number,
    data: UpdateInquiryInput,
    transaction: Transaction,
) => {
    return Inquiry.update(data, { where: { id: inquiryId }, transaction });
};

const findImagesByInquiryId = async (inquiryId: number, transaction: Transaction) => {
    return Image.findAll({
        where: { entity_type: "inquiry", entity_id: inquiryId },
        transaction,
    });
};

const findImagesByInquiryIds = async (inquiryIds: number[]) => {
    if (inquiryIds.length === 0) {
        return [];
    }
    return Image.findAll({
        where: { entity_type: "inquiry", entity_id: { [Op.in]: inquiryIds } },
        order: [
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const deleteImagesByInquiryId = async (inquiryId: number, transaction: Transaction) => {
    return Image.destroy({
        where: { entity_type: "inquiry", entity_id: inquiryId },
        transaction,
    });
};

const deleteInquiryById = async (id: number, transaction: Transaction) => {
    return Inquiry.destroy({ where: { id }, transaction });
};

const bulkCreateImages = async (data: CreateImageInput[], transaction: Transaction) => {
    if (data.length === 0) {
        return [];
    }
    return Image.bulkCreate(data, { transaction });
};

export default {
    createInquiry,
    findAllInquiries,
    findInquiryById,
    updateInquiryById,
    findImagesByInquiryId,
    findImagesByInquiryIds,
    deleteImagesByInquiryId,
    deleteInquiryById,
    bulkCreateImages,
};
