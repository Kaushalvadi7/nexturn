import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import inquiryRepository from "../repository/inquiry.repository";
import imageService from "../services/image.service";
import emailService from "../services/email.service";
import logger from "../utils/logger";

const getFilesFromRequest = (req: Request) => {
    const files: Express.Multer.File[] = [];
    if (req.files && Array.isArray(req.files)) {
        files.push(...req.files);
    }
    return files;
};

const createInquiry = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const {
            full_name,
            email,
            phone,
            company_name,
            category_name,
            subject,
            message,
        } = req.body as {
            full_name?: string;
            email?: string;
            phone?: string;
            company_name?: string;
            category_name?: string;
            subject?: string;
            message?: string;
        };

        if (!full_name || !email || !message) {
            await transaction.rollback();
            return next(new HttpException(400, "full_name, email and message are required."));
        }

        const inquiry = await inquiryRepository.createInquiry(
            {
                full_name,
                email,
                phone: phone ?? null,
                company_name: company_name ?? null,
                category_name: category_name ?? null,
                subject: subject ?? null,
                message,
                status: null,
                is_viewed: false,
                created_at: new Date(),
            },
            transaction,
        );

        const files = getFilesFromRequest(req);
        if (files.length > 0) {
            const uploaded =
                files.length === 1
                    ? [await imageService.uploadImage(files[0].path)]
                    : await imageService.uploadImages(files.map(file => file.path));

            const imageRows = uploaded.map((item, index) => ({
                entity_type: "inquiry" as const,
                entity_id: inquiry.id,
                image_url: item.secureUrl,
                public_id: item.publicId,
                is_primary: index === 0,
                sort_order: index,
            }));

            await inquiryRepository.bulkCreateImages(imageRows, transaction);
        }

        await transaction.commit();

        const inquiryPlain = inquiry.toJSON() as {
            id: number;
            full_name: string;
            email: string;
            phone: string | null;
            company_name: string | null;
            category_name: string | null;
            subject: string | null;
            message: string;
            created_at: Date | null;
        };

        // Send email in background so API response is not blocked by SMTP latency.
        void emailService
            .sendInquiryCreatedNotification(inquiryPlain, files.length)
            .catch((error) => {
                logger.error("Failed to send inquiry notification email", { error });
            });

        return res.status(201).json({
            message: "Inquiry created successfully",
            data: { id: inquiry.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllInquiries = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const inquiries = await inquiryRepository.findAllInquiries();
        const inquiryIds = inquiries.map(item => item.id);

        const images = await inquiryRepository.findImagesByInquiryIds(inquiryIds);
        const imagesByInquiryId = images.reduce<Record<number, any[]>>((acc, img) => {
            const plain = img.toJSON();
            const entityId = plain.entity_id as number;
            if (!acc[entityId]) acc[entityId] = [];
            acc[entityId].push(plain);
            return acc;
        }, {});

        const data = inquiries.map(item => {
            const plain = item.toJSON();
            return {
                ...plain,
                images: imagesByInquiryId[item.id] || [],
            };
        });

        return res.status(200).json({ data });
    } catch (error) {
        return next(error as Error);
    }
};

const getInquiryById = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid inquiry id."));
        }

        const inquiry = await inquiryRepository.findInquiryById(id, transaction);
        if (!inquiry) {
            await transaction.rollback();
            return next(new HttpException(404, "Inquiry not found."));
        }

        const images = await inquiryRepository.findImagesByInquiryId(id, transaction);
        await transaction.commit();

        return res.status(200).json({
            data: {
                ...inquiry.toJSON(),
                images: images.map(img => img.toJSON()),
            },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateInquiry = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid inquiry id."));
        }

        const inquiry = await inquiryRepository.findInquiryById(id, transaction);
        if (!inquiry) {
            await transaction.rollback();
            return next(new HttpException(404, "Inquiry not found."));
        }

        const updates: {
            status?: string | null;
            is_viewed?: boolean | null;
            subject?: string | null;
            message?: string;
        } = {};

        if (Object.prototype.hasOwnProperty.call(req.body, "status")) {
            updates.status = req.body.status ?? null;
        }
        if (Object.prototype.hasOwnProperty.call(req.body, "is_viewed")) {
            updates.is_viewed =
                req.body.is_viewed === true ||
                req.body.is_viewed === "true" ||
                req.body.is_viewed === 1 ||
                req.body.is_viewed === "1";
        }
        if (Object.prototype.hasOwnProperty.call(req.body, "subject")) {
            updates.subject = req.body.subject ?? null;
        }
        if (Object.prototype.hasOwnProperty.call(req.body, "message")) {
            updates.message = req.body.message;
        }

        if (Object.keys(updates).length > 0) {
            await inquiryRepository.updateInquiryById(id, updates, transaction);
        }

        await transaction.commit();
        return res.status(200).json({ message: "Inquiry updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteInquiry = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid inquiry id."));
        }

        const inquiry = await inquiryRepository.findInquiryById(id, transaction);
        if (!inquiry) {
            await transaction.rollback();
            return next(new HttpException(404, "Inquiry not found."));
        }

        const images = await inquiryRepository.findImagesByInquiryId(id, transaction);
        const publicIds = images.map(img => img.public_id).filter(Boolean) as string[];

        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(publicId => imageService.deleteImage(publicId)));
        }

        await inquiryRepository.deleteImagesByInquiryId(id, transaction);
        await inquiryRepository.deleteInquiryById(id, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Inquiry deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default { createInquiry, getAllInquiries, getInquiryById, updateInquiry, deleteInquiry };
