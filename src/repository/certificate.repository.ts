import { Transaction } from "sequelize";
import Certificate from "../models/Certificate";

type CreateCertificateInput = {
    name: string;
};

const createCertificate = async (data: CreateCertificateInput, transaction: Transaction) => {
    return Certificate.create(data, { transaction });
};

const findCertificateById = async (id: number, transaction?: Transaction) => {
    return Certificate.findByPk(id, { transaction });
};

const findAllCertificates = async () => {
    return Certificate.findAll({ order: [["id", "ASC"]] });
};

const deleteCertificateById = async (id: number, transaction: Transaction) => {
    return Certificate.destroy({ where: { id }, transaction });
};

export default {
    createCertificate,
    findCertificateById,
    findAllCertificates,
    deleteCertificateById,
};
