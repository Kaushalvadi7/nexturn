import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import companyEmployeeRepository from "../repository/company-employee.repository";
import imageService from "../services/image.service";

const getFilesFromRequest = (req: Request) => {
    const files: Express.Multer.File[] = [];
    if (req.file) {
        files.push(req.file);
    }

    if (req.files) {
        if (Array.isArray(req.files)) {
            files.push(...req.files);
        } else {
            const fileMap = req.files as Record<string, Express.Multer.File[]>;
            if (fileMap.image) {
                files.push(...fileMap.image);
            }
        }
    }
    return files;
};

type CompanyEmployeeInput = {
    name?: string;
    role?: string;
    education?: string | null;
    experience?: string | null;
};

const getAllCompanyEmployees = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const employees = await companyEmployeeRepository.findAllCompanyEmployees();
        const employeeIds = employees.map(item => item.id);
        const images = await companyEmployeeRepository.findImagesByEmployeeIds(employeeIds);

        const imagesByEmployeeId = images.reduce<Record<number, any[]>>((acc, img) => {
            const plain = img.toJSON();
            const entityId = plain.entity_id as number;
            if (!acc[entityId]) acc[entityId] = [];
            acc[entityId].push(plain);
            return acc;
        }, {});

        const data = employees.map(item => {
            const plain = item.toJSON() as any;
            const employeeImages = imagesByEmployeeId[item.id] || [];
            const primary =
                employeeImages.find((img: any) => img.is_primary)?.image_url ||
                employeeImages[0]?.image_url ||
                null;
            return {
                ...plain,
                images: employeeImages,
                image: primary,
            };
        });

        return res.status(200).json({ data });
    } catch (error) {
        return next(error as Error);
    }
};

const createCompanyEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { name, role, education, experience } = req.body as CompanyEmployeeInput;

        if (!name || !name.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "name is required."));
        }

        if (!role || !role.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "role is required."));
        }

        const employee = await companyEmployeeRepository.createCompanyEmployee(
            {
                name: name.trim(),
                role: role.trim(),
                education: education?.trim() || null,
                experience: experience?.trim() || null,
            },
            transaction,
        );

        const files = getFilesFromRequest(req);
        if (files.length > 1) {
            await transaction.rollback();
            return next(new HttpException(400, "Only one image is allowed."));
        }

        if (files.length === 1) {
            const uploaded = await imageService.uploadImage(files[0].path);
            await companyEmployeeRepository.bulkCreateImages(
                [
                    {
                        entity_type: "company_employee",
                        entity_id: employee.id,
                        image_url: uploaded.secureUrl,
                        public_id: uploaded.publicId,
                        is_primary: true,
                        sort_order: 0,
                    },
                ],
                transaction,
            );
        }

        await transaction.commit();
        return res.status(201).json({
            message: "Company employee created successfully",
            data: { id: employee.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateCompanyEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid company employee id."));
        }

        const employee = await companyEmployeeRepository.findCompanyEmployeeById(id, transaction);
        if (!employee) {
            await transaction.rollback();
            return next(new HttpException(404, "Company employee not found."));
        }

        const body = req.body as CompanyEmployeeInput;
        const updates: {
            name?: string;
            role?: string;
            education?: string | null;
            experience?: string | null;
            updated_at?: Date;
        } = {};

        if (Object.prototype.hasOwnProperty.call(body, "name")) {
            if (!body.name || !body.name.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "name cannot be empty."));
            }
            updates.name = body.name.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "role")) {
            if (!body.role || !body.role.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "role cannot be empty."));
            }
            updates.role = body.role.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "education")) {
            updates.education = body.education?.trim() || null;
        }

        if (Object.prototype.hasOwnProperty.call(body, "experience")) {
            updates.experience = body.experience?.trim() || null;
        }

        if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date();
            await companyEmployeeRepository.updateCompanyEmployeeById(id, updates, transaction);
        }

        const files = getFilesFromRequest(req);
        if (files.length > 1) {
            await transaction.rollback();
            return next(new HttpException(400, "Only one image is allowed."));
        }

        if (files.length === 1) {
            const existingImages = await companyEmployeeRepository.findImagesByEmployeeId(id, transaction);
            const publicIds = existingImages.map(img => img.public_id).filter(Boolean) as string[];
            if (publicIds.length > 0) {
                await Promise.all(publicIds.map(publicId => imageService.deleteImage(publicId)));
            }

            await companyEmployeeRepository.deleteImagesByEmployeeId(id, transaction);

            const uploaded = await imageService.uploadImage(files[0].path);
            await companyEmployeeRepository.bulkCreateImages(
                [
                    {
                        entity_type: "company_employee",
                        entity_id: id,
                        image_url: uploaded.secureUrl,
                        public_id: uploaded.publicId,
                        is_primary: true,
                        sort_order: 0,
                    },
                ],
                transaction,
            );
        }

        await transaction.commit();
        return res.status(200).json({ message: "Company employee updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteCompanyEmployee = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid company employee id."));
        }

        const employee = await companyEmployeeRepository.findCompanyEmployeeById(id, transaction);
        if (!employee) {
            await transaction.rollback();
            return next(new HttpException(404, "Company employee not found."));
        }

        const images = await companyEmployeeRepository.findImagesByEmployeeId(id, transaction);
        const publicIds = images.map(img => img.public_id).filter(Boolean) as string[];
        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(publicId => imageService.deleteImage(publicId)));
        }

        await companyEmployeeRepository.deleteImagesByEmployeeId(id, transaction);
        await companyEmployeeRepository.deleteCompanyEmployeeById(id, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Company employee deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default {
    getAllCompanyEmployees,
    createCompanyEmployee,
    updateCompanyEmployee,
    deleteCompanyEmployee,
};

