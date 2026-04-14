import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import productRepository from "../repository/product.repository";
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

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
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

        const categoryIdRaw = req.body.category_id;
        const category_id =
            categoryIdRaw !== undefined && categoryIdRaw !== null && categoryIdRaw !== ""
                ? Number(categoryIdRaw)
                : null;

        if (category_id !== null && Number.isNaN(category_id)) {
            await transaction.rollback();
            return next(new HttpException(400, "category_id must be a number."));
        }

        /* Commented out as requested
        const applications = parseJsonField<string[]>(req.body.applications, []);
        const specifications = parseJsonField<Record<string, unknown>>(
            req.body.specifications,
            {},
        );
        const materialGrades = parseJsonField<MaterialGradeInput[]>(
            req.body.material_grades,
            [],
        );
        */

        const product = await productRepository.createProduct(
            {
                category_id,
                name,
                description: description ?? null,
                applications: [], // applications,
                specifications: {}, // specifications,
            },
            transaction,
        );

        /* Commented out as requested
        const gradeRows = materialGrades
            .filter(item => item && item.grade)
            .map((item, index) => ({
                entity_type: "product" as const,
                entity_id: product.id,
                grade: item.grade,
                standard: item.standard ?? null,
                notes: item.notes ?? null,
                sort_order: item.sort_order ?? index,
            }));

        await productRepository.bulkCreateMaterialGrades(gradeRows, transaction);
        */

        const files = getFilesFromRequest(req);
        if (files.length > 0) {
            const uploaded =
                files.length === 1
                    ? [await imageService.uploadImage(files[0].path)]
                    : await imageService.uploadImages(files.map(file => file.path));

            const imageRows = uploaded.map((item, index) => ({
                entity_type: "product" as const,
                entity_id: product.id,
                image_url: item.secureUrl,
                public_id: item.publicId,
                is_primary: index === 0,
                sort_order: index,
            }));

            await productRepository.bulkCreateImages(imageRows, transaction);
        }

        await transaction.commit();

        return res.status(201).json({
            message: "Product created successfully",
            data: { id: product.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid product id."));
        }

        const product = await productRepository.findProductById(id, transaction);
        if (!product) {
            await transaction.rollback();
            return next(new HttpException(404, "Product not found."));
        }

        const updates: {
            category_id?: number | null;
            name?: string;
            description?: string | null;
            applications?: unknown;
            specifications?: unknown;
            updated_at?: Date;
        } = {};

        if (Object.prototype.hasOwnProperty.call(req.body, "category_id")) {
            const categoryIdRaw = req.body.category_id;
            const category_id =
                categoryIdRaw !== undefined &&
                categoryIdRaw !== null &&
                categoryIdRaw !== ""
                    ? Number(categoryIdRaw)
                    : null;

            if (category_id !== null && Number.isNaN(category_id)) {
                await transaction.rollback();
                return next(new HttpException(400, "category_id must be a number."));
            }
            updates.category_id = category_id;
        }

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

        if (Object.prototype.hasOwnProperty.call(req.body, "specifications")) {
            updates.specifications = parseJsonField<Record<string, unknown>>(
                req.body.specifications,
                {},
            );
        }
        */

        if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date();
            await productRepository.updateProductById(id, updates, transaction);
        }

        /* Commented out as requested
        if (Object.prototype.hasOwnProperty.call(req.body, "material_grades")) {
            const materialGrades = parseJsonField<MaterialGradeInput[]>(
                req.body.material_grades,
                [],
            );

            await productRepository.deleteMaterialGradesByProductId(id, transaction);

            const gradeRows = materialGrades
                .filter(item => item && item.grade)
                .map((item, index) => ({
                    entity_type: "product" as const,
                    entity_id: id,
                    grade: item.grade,
                    standard: item.standard ?? null,
                    notes: item.notes ?? null,
                    sort_order: item.sort_order ?? index,
                }));

            await productRepository.bulkCreateMaterialGrades(gradeRows, transaction);
        }
        */

        const deletedImages = parseJsonField<string[]>(req.body.deleted_images, []);
        if (deletedImages.length > 0) {
            const existingToDelete = await productRepository.findImagesByProductIdAndUrls(
                id,
                deletedImages,
                transaction,
            );
            const publicIds = existingToDelete
                .map(img => img.public_id)
                .filter(Boolean) as string[];

            if (publicIds.length > 0) {
                await Promise.all(
                    publicIds.map(publicId => imageService.deleteImage(publicId)),
                );
            }

            await productRepository.deleteImagesByProductUrls(
                id,
                deletedImages,
                transaction,
            );
        }

        const files = getFilesFromRequest(req);
        if (files.length > 0) {
            const uploaded =
                files.length === 1
                    ? [await imageService.uploadImage(files[0].path)]
                    : await imageService.uploadImages(files.map(file => file.path));

            const existingImages = await productRepository.findImagesByProductId(
                id,
                transaction,
            );
            const baseSortOrder = existingImages.length;
            const hasPrimary = existingImages.some(img => img.is_primary);

            const imageRows = uploaded.map((item, index) => ({
                entity_type: "product" as const,
                entity_id: id,
                image_url: item.secureUrl,
                public_id: item.publicId,
                is_primary: !hasPrimary && index === 0,
                sort_order: baseSortOrder + index,
            }));

            await productRepository.bulkCreateImages(imageRows, transaction);
        }

        await transaction.commit();

        return res.status(200).json({ message: "Product updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid product id."));
        }

        const product = await productRepository.findProductById(id, transaction);
        if (!product) {
            await transaction.rollback();
            return next(new HttpException(404, "Product not found."));
        }

        const images = await productRepository.findImagesByProductId(id, transaction);
        const publicIds = images.map(img => img.public_id).filter(Boolean) as string[];

        if (publicIds.length > 0) {
            await Promise.all(publicIds.map(publicId => imageService.deleteImage(publicId)));
        }

        await productRepository.deleteImagesByProductId(id, transaction);
        await productRepository.deleteMaterialGradesByProductId(id, transaction);
        await productRepository.deleteProductById(id, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await productRepository.findAllProducts();
        const productIds = products.map(product => product.id);

        const [images, materialGrades] = await Promise.all([
            productRepository.findImagesByProductIds(productIds),
            productRepository.findMaterialGradesByProductIds(productIds),
        ]);

        const imagesByProductId = images.reduce<Record<number, any[]>>(
            (acc, img) => {
                const plain = img.toJSON();
                const entityId = plain.entity_id as number;
                if (!acc[entityId]) acc[entityId] = [];
                acc[entityId].push(plain);
                return acc;
            },
            {},
        );

        const gradesByProductId = materialGrades.reduce<Record<number, any[]>>((acc, grade) => {
            const plain = grade.toJSON();
            const entityId = plain.entity_id as number;
            if (!acc[entityId]) acc[entityId] = [];
            acc[entityId].push(plain);
            return acc;
        }, {});

        const data = products.map(product => {
            const plain = product.toJSON();
            return {
                ...plain,
                images: imagesByProductId[product.id] || [],
                material_grades: gradesByProductId[product.id] || [],
            };
        });

        return res.status(200).json({ data });
    } catch (error) {
        return next(error as Error);
    }
};

export default { createProduct, updateProduct, deleteProduct, getAllProducts };
