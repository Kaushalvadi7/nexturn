import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import categoryRepository from "../repository/category.repository";
import imageService from "../services/image.service";

type MaterialGradeInput = {
    grade: string;
    standard?: string;
    notes?: string;
    sort_order?: number;
};

const parseJsonField = <T>(value: unknown, fallback: T): T => {
    if (value === undefined || value === null || value === "") {
        return fallback;
    }
    if (typeof value === "string") {
        try {
            return JSON.parse(value) as T;
        } catch {
            return fallback;
        }
    }
    return value as T;
};

const normalizeTextListField = (value: unknown): string | null => {
    const items = parseJsonField<unknown[]>(value, []);
    if (!Array.isArray(items)) {
        return null;
    }

    const normalized = items
        .map((item) => {
            if (typeof item === "string") {
                return item.trim();
            }

            if (item && typeof item === "object") {
                const key = String((item as { key?: unknown }).key || "").trim();
                const itemValue = String((item as { value?: unknown }).value || "").trim();

                if (key && itemValue) {
                    return `${key}: ${itemValue}`;
                }
                return key || itemValue;
            }

            return "";
        })
        .filter(Boolean);

    return normalized.length > 0 ? JSON.stringify(normalized) : null;
};

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
            if (fileMap.images) {
                files.push(...fileMap.images);
            }
        }
    }
    return files;
};

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { name, description } = req.body as {
            name?: string;
            description?: string;
        };

        if (!name) {
            await transaction.rollback();
            return next(new HttpException(400, "Name is required."));
        }

        /* Commented out as requested
        const applications = parseJsonField<string[]>(req.body.applications, []);
        const materialGrades = parseJsonField<MaterialGradeInput[]>(req.body.material_grades, []);
        */
        const process = normalizeTextListField(req.body.process);
        const surface_finish = normalizeTextListField(req.body.surface_finish);

        const category = await categoryRepository.createCategory(
            {
                name,
                description: description ?? null,
                process,
                surface_finish,
                applications: [], // applications,
            },
            transaction,
        );

        /* Commented out as requested
        const gradeRows = materialGrades
            .filter((item) => item && item.grade)
            .map((item, index) => ({
                entity_type: "category" as const,
                entity_id: category.id,
                grade: item.grade,
                standard: item.standard ?? null,
                notes: item.notes ?? null,
                sort_order: item.sort_order ?? index,
            }));

        await categoryRepository.bulkCreateMaterialGrades(gradeRows, transaction);
        */

        const files = getFilesFromRequest(req);
        if (files.length > 0) {
            const uploaded =
                files.length === 1
                    ? [await imageService.uploadImage(files[0].path)]
                    : await imageService.uploadImages(files.map((file) => file.path));

            const imageRows = uploaded.map((item, index) => ({
                entity_type: "category" as const,
                entity_id: category.id,
                image_url: item.secureUrl,
                public_id: item.publicId,
                is_primary: index === 0,
                sort_order: index,
            }));

            await categoryRepository.bulkCreateImages(imageRows, transaction);
        }

        await transaction.commit();

        return res.status(201).json({
            message: "Category created successfully",
            data: { id: category.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid category id."));
        }

        const category = await categoryRepository.findCategoryById(id, transaction);
        if (!category) {
            await transaction.rollback();
            return next(new HttpException(404, "Category not found."));
        }

        const updates: {
            name?: string;
            description?: string | null;
            process?: string | null;
            surface_finish?: string | null;
            applications?: unknown;
            updated_at?: Date;
        } = {};

        if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
            const { name } = req.body as { name?: string };
            if (!name) {
                await transaction.rollback();
                return next(new HttpException(400, "Name is required."));
            }
            updates.name = name;
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "description")) {
            const { description } = req.body as { description?: string };
            updates.description = description ? description : null;
        }

        /* Commented out as requested
        if (Object.prototype.hasOwnProperty.call(req.body, "applications")) {
            updates.applications = parseJsonField<string[]>(req.body.applications, []);
        }
        */

        if (Object.prototype.hasOwnProperty.call(req.body, "process")) {
            updates.process = normalizeTextListField(req.body.process);
        }

        if (Object.prototype.hasOwnProperty.call(req.body, "surface_finish")) {
            updates.surface_finish = normalizeTextListField(req.body.surface_finish);
        }

        if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date();
            await categoryRepository.updateCategoryById(id, updates, transaction);
        }

        /* Commented out as requested
        if (Object.prototype.hasOwnProperty.call(req.body, "material_grades")) {
            const materialGrades = parseJsonField<MaterialGradeInput[]>(req.body.material_grades, []);

            await categoryRepository.deleteMaterialGradesByCategoryId(id, transaction);

            const gradeRows = materialGrades
                .filter((item) => item && item.grade)
                .map((item, index) => ({
                    entity_type: "category" as const,
                    entity_id: id,
                    grade: item.grade,
                    standard: item.standard ?? null,
                    notes: item.notes ?? null,
                    sort_order: item.sort_order ?? index,
                }));

            await categoryRepository.bulkCreateMaterialGrades(gradeRows, transaction);
        }
        */

        const deletedImages = parseJsonField<string[]>(req.body.deleted_images, []);
        if (deletedImages.length > 0) {
            const existingToDelete = await categoryRepository.findImagesByCategoryIdAndUrls(
                id,
                deletedImages,
                transaction,
            );
            const publicIds = existingToDelete
                .map((img) => img.public_id)
                .filter(Boolean) as string[];

            if (publicIds.length > 0) {
                await Promise.all(publicIds.map((publicId) => imageService.deleteImage(publicId)));
            }

            await categoryRepository.deleteImagesByCategoryUrls(id, deletedImages, transaction);
        }

        const files = getFilesFromRequest(req);
        if (files.length > 0) {
            const uploaded =
                files.length === 1
                    ? [await imageService.uploadImage(files[0].path)]
                    : await imageService.uploadImages(files.map((file) => file.path));

            const existingImages = await categoryRepository.findImagesByCategoryId(id, transaction);
            const baseSortOrder = existingImages.length;
            const hasPrimary = existingImages.some((img) => img.is_primary);

            const imageRows = uploaded.map((item, index) => ({
                entity_type: "category" as const,
                entity_id: id,
                image_url: item.secureUrl,
                public_id: item.publicId,
                is_primary: !hasPrimary && index === 0,
                sort_order: baseSortOrder + index,
            }));

            await categoryRepository.bulkCreateImages(imageRows, transaction);
        }

        await transaction.commit();

        return res.status(200).json({ message: "Category updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid category id."));
        }

        const category = await categoryRepository.findCategoryById(id, transaction);
        if (!category) {
            await transaction.rollback();
            return next(new HttpException(404, "Category not found."));
        }

        const images = await categoryRepository.findImagesByCategoryId(id, transaction);
        const publicIds = images.map((img) => img.public_id).filter(Boolean) as string[];

        if (publicIds.length > 0) {
            await Promise.all(publicIds.map((publicId) => imageService.deleteImage(publicId)));
        }

        await categoryRepository.deleteImagesByCategoryId(id, transaction);
        await categoryRepository.deleteMaterialGradesByCategoryId(id, transaction);
        await categoryRepository.deleteCategoryById(id, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllCategories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const categories = await categoryRepository.findAllCategories();
        const categoryIds = categories.map(category => category.id);

        const [images, materialGrades] = await Promise.all([
            categoryRepository.findImagesByCategoryIds(categoryIds),
            categoryRepository.findMaterialGradesByCategoryIds(categoryIds),
        ]);

        const imagesByCategoryId = images.reduce<Record<number, any[]>>((acc, img) => {
            const plain = img.toJSON();
            const entityId = plain.entity_id as number;
            if (!acc[entityId]) acc[entityId] = [];
            acc[entityId].push(plain);
            return acc;
        }, {});

        const gradesByCategoryId = materialGrades.reduce<Record<number, any[]>>((acc, grade) => {
            const plain = grade.toJSON();
            const entityId = plain.entity_id as number;
            if (!acc[entityId]) acc[entityId] = [];
            acc[entityId].push(plain);
            return acc;
        }, {});

        const data = categories.map(category => {
            const plain = category.toJSON();
            return {
                ...plain,
                images: imagesByCategoryId[category.id] || [],
                material_grades: gradesByCategoryId[category.id] || [],
            };
        });

        return res.status(200).json({ data });
    } catch (error) {
        return next(error as Error);
    }
};

export default { createCategory, updateCategory, deleteCategory, getAllCategories };
