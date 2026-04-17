import { Op } from "sequelize";
import CompanyProfileDownload from "../models/CompanyProfileDownload";

type CreateCompanyProfileDownloadInput = {
    name: string;
    email: string;
    created_at: Date;
};

type FindCompanyProfileDownloadsInput = {
    email?: string;
    startDate?: Date;
    endDate?: Date;
    page: number;
    limit: number;
};

const createCompanyProfileDownload = async (data: CreateCompanyProfileDownloadInput) => {
    return CompanyProfileDownload.create(data);
};

const findCompanyProfileDownloads = async (filters: FindCompanyProfileDownloadsInput) => {
    const where: any = {};

    if (filters.email) {
        where.email = { [Op.iLike]: `%${filters.email}%` };
    }

    if (filters.startDate && filters.endDate) {
        where.created_at = { [Op.between]: [filters.startDate, filters.endDate] };
    } else if (filters.startDate) {
        where.created_at = { [Op.gte]: filters.startDate };
    } else if (filters.endDate) {
        where.created_at = { [Op.lte]: filters.endDate };
    }

    const offset = (filters.page - 1) * filters.limit;

    return CompanyProfileDownload.findAndCountAll({
        where,
        order: [
            ["created_at", "DESC"],
            ["id", "DESC"],
        ],
        limit: filters.limit,
        offset,
    });
};

export default {
    createCompanyProfileDownload,
    findCompanyProfileDownloads,
};
