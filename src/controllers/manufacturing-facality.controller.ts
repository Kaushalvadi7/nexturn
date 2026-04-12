import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import manufacturingFacalityRepository from "../repository/manufacturing-facality.repository";
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

type ManufacturingFacalityInput = {
    title?: string;
    description?: string | null;
};

const getAllManufacturingFacalities = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const rows = await manufacturingFacalityRepository.findAllManufacturingFacalities();
        const ids = rows.map(item => item.id);
        const images = await manufacturingFacalityRepository.findImagesByFacalityIds(ids);

        const imagesById = images.reduce<Record<number, any[]>>((acc, img) => {
            const plain = img.toJSON();
            const entityId = plain.entity_id as number;
            if (!acc[entityId]) acc[entityId] = [];
            acc[entityId].push(plain);
            return acc;
        }, {});

        const data = rows.map(row => {
            const plain = row.toJSON() as any;
            const facilityImages = imagesById[row.id] || [];
            const primary =
                facilityImages.find((img: any) => img.is_primary)?.image_url ||
                facilityImages[0]?.image_url ||
                null;
            return {
                ...plain,
                images: facilityImages,
                image: primary,
            };
        });

        return res.status(200).json({ data });
    } catch (error) {
        return next(error as Error);
    }
};

const createManufacturingFacality = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { title, description } = req.body as ManufacturingFacalityInput;
        if (!title || !title.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "title is required."));
        }

        const facality = await manufacturingFacalityRepository.createManufacturingFacality(
            { title: title.trim(), description: description?.trim() || null },
            transaction,
        );

        const files = getFilesFromRequest(req);
        if (files.length > 1) {
            await transaction.rollback();
            return next(new HttpException(400, "Only one image is allowed."));
        }

        if (files.length === 1) {
            const uploaded = await imageService.uploadImage(files[0].path);
            await manufacturingFacalityRepository.bulkCreateImages(
                [
                    {
                        entity_type: "manufacturing_facality",
                        entity_id: facality.id,
                        image_url: uploaded.secureUrl,
                        public_id: uploaded.publicId,
                        is_primary: true,
                        sort_order: 0,
                    },
                ],
                transaction,
            );
        }

        const images = await manufacturingFacalityRepository.findImagesByFacalityId(facality.id, transaction);
        const plainImages = images.map((img) => img.toJSON());
        const primary =
            plainImages.find((img: any) => img.is_primary)?.image_url ||
            (plainImages[0] as any)?.image_url ||
            null;

        await transaction.commit();
        return res.status(201).json({
            message: "Manufacturing facality created successfully",
            data: {
                ...(facality.toJSON() as any),
                images: plainImages,
                image: primary,
            },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateManufacturingFacality = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid manufacturing facality id."));
        }

        const existing = await manufacturingFacalityRepository.findManufacturingFacalityById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Manufacturing facality not found."));
        }

        const body = req.body as ManufacturingFacalityInput;
        const updates: { title?: string; description?: string | null; updated_at?: Date } = {};

        if (Object.prototype.hasOwnProperty.call(body, "title")) {
            if (!body.title || !body.title.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "title cannot be empty."));
            }
            updates.title = body.title.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "description")) {
            updates.description = body.description?.trim() || null;
        }

        if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date();
            await manufacturingFacalityRepository.updateManufacturingFacalityById(id, updates, transaction);
        }

        const files = getFilesFromRequest(req);
        if (files.length > 1) {
            await transaction.rollback();
            return next(new HttpException(400, "Only one image is allowed."));
        }

        if (files.length === 1) {
            const existingImages = await manufacturingFacalityRepository.findImagesByFacalityId(id, transaction);
            const publicIds = existingImages.map(img => img.public_id).filter(Boolean) as string[];
            if (publicIds.length > 0) {
                await Promise.all(publicIds.map(publicId => imageService.deleteImage(publicId)));
            }

            await manufacturingFacalityRepository.deleteImagesByFacalityId(id, transaction);

            const uploaded = await imageService.uploadImage(files[0].path);
            await manufacturingFacalityRepository.bulkCreateImages(
                [
                    {
                        entity_type: "manufacturing_facality",
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

        const updated = await manufacturingFacalityRepository.findManufacturingFacalityById(id, transaction);
        const images = await manufacturingFacalityRepository.findImagesByFacalityId(id, transaction);
        const plainImages = images.map((img) => img.toJSON());
        const primary =
            plainImages.find((img: any) => img.is_primary)?.image_url ||
            (plainImages[0] as any)?.image_url ||
            null;

        await transaction.commit();
        return res.status(200).json({
            message: "Manufacturing facality updated successfully",
            data: {
                ...((updated || existing).toJSON() as any),
                images: plainImages,
                image: primary,
            },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteManufacturingFacality = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid manufacturing facality id."));
        }

        const existing = await manufacturingFacalityRepository.findManufacturingFacalityById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Manufacturing facality not found."));
        }

        const images = await manufacturingFacalityRepository.findImagesByFacalityId(id, transaction);
        const publicIds = images.map(img => img.public_id).filter(Boolean) as string[];
        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(publicId => imageService.deleteImage(publicId)));
        }

        await manufacturingFacalityRepository.deleteImagesByFacalityId(id, transaction);
        await manufacturingFacalityRepository.deleteManufacturingFacalityById(id, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Manufacturing facality deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default {
    getAllManufacturingFacalities,
    createManufacturingFacality,
    updateManufacturingFacality,
    deleteManufacturingFacality,
};
