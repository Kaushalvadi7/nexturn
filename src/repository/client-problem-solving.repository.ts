import { Transaction } from "sequelize";
import ClientProblemSolving from "../models/ClientProblemSolving";

type CreateClientProblemSolvingInput = {
    client_name: string;
    product_name: string;
    client_location: string;
    year: number;
    challange?: string | null;
    solution?: string | null;
    results: string[];
};

type UpdateClientProblemSolvingInput = Partial<CreateClientProblemSolvingInput> & {
    updated_at?: Date;
};

const createClientProblemSolving = async (
    data: CreateClientProblemSolvingInput,
    transaction: Transaction,
) => {
    return ClientProblemSolving.create(data, { transaction });
};

const findAllClientProblemSolving = async () => {
    return ClientProblemSolving.findAll({ order: [["id", "ASC"]] });
};

const findClientProblemSolvingById = async (id: number, transaction?: Transaction) => {
    return ClientProblemSolving.findByPk(id, { transaction });
};

const updateClientProblemSolvingById = async (
    id: number,
    updates: UpdateClientProblemSolvingInput,
    transaction: Transaction,
) => {
    return ClientProblemSolving.update(updates, { where: { id }, transaction });
};

const deleteClientProblemSolvingById = async (id: number, transaction: Transaction) => {
    return ClientProblemSolving.destroy({ where: { id }, transaction });
};

export default {
    createClientProblemSolving,
    findAllClientProblemSolving,
    findClientProblemSolvingById,
    updateClientProblemSolvingById,
    deleteClientProblemSolvingById,
};

