import { Transaction } from "sequelize";
import ClientSuccessStory from "../models/ClientSuccessStory";

type CreateClientSuccessStoryInput = {
    stars?: number | null;
    client_name: string;
    client_position?: string | null;
    client_city?: string | null;
    description?: string | null;
    client_purchase?: string | null;
};

const createClientSuccessStory = async (
    data: CreateClientSuccessStoryInput,
    transaction: Transaction,
) => {
    return ClientSuccessStory.create(data, { transaction });
};

const findClientSuccessStoryById = async (id: number, transaction?: Transaction) => {
    return ClientSuccessStory.findByPk(id, { transaction });
};

const deleteClientSuccessStoryById = async (id: number, transaction: Transaction) => {
    return ClientSuccessStory.destroy({ where: { id }, transaction });
};

const findAllClientSuccessStories = async () => {
    return ClientSuccessStory.findAll({ order: [["id", "DESC"]] });
};

export default {
    createClientSuccessStory,
    findClientSuccessStoryById,
    deleteClientSuccessStoryById,
    findAllClientSuccessStories,
};
