import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import materialSpecializationRepository from "../repository/material-specialization.repository";
import imageService from "../services/image.service";

type MaterialSpecializationInput = {
    image_url?: string | null;
    public_url?: string | null;
    title?: string;
    description?: string | null;
    grades?: unknown;
    common_application?: unknown;
};

const normalizeStringArray = (value: unknown): string[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.map(item => String(item ?? "").trim()).filter(Boolean);
};

const normalizeMaterialSpecialization = (item: MaterialSpecializationInput, index?: number) => {
    if (!item?.title?.trim()) {
        return {
            error: `Material specialization${index !== undefined ? ` at index ${index}` : ""} is missing title.`,
        };
    }

    if (!item?.image_url?.trim()) {
        return {
            error: `Material specialization${index !== undefined ? ` at index ${index}` : ""} is missing image_url.`,
        };
    }

    if (!item?.description?.trim()) {
        return {
            error: `Material specialization${index !== undefined ? ` at index ${index}` : ""} is missing description.`,
        };
    }

    const grades = normalizeStringArray(item.grades);
    if (grades.length === 0) {
        return {
            error: `Material specialization${index !== undefined ? ` at index ${index}` : ""} must include at least 1 grade.`,
        };
    }

    const commonApplication = normalizeStringArray(item.common_application);
    if (commonApplication.length === 0) {
        return {
            error: `Material specialization${index !== undefined ? ` at index ${index}` : ""} must include at least 1 common_application.`,
        };
    }

    return {
        data: {
            image_url: item.image_url?.trim() || null,
            public_url: item.public_url?.trim() || null,
            title: item.title.trim(),
            description: item.description.trim(),
            grades,
            common_application: commonApplication,
        },
    };
};

const extractPublicUrls = (items: Array<{ public_url?: string | null }>) => {
    return new Set(
        items
            .map(item => item.public_url?.trim())
            .filter((value): value is string => Boolean(value)),
    );
};

const createMaterialSpecialization = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const normalized = normalizeMaterialSpecialization(req.body as MaterialSpecializationInput);
        if (normalized.error) {
            await transaction.rollback();
            return next(new HttpException(400, normalized.error));
        }

        const material = await materialSpecializationRepository.createMaterialSpecialization(
            normalized.data!,
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Material specialization created successfully",
            data: { id: material.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateMaterialSpecialization = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid material specialization id."));
        }

        const existing = await materialSpecializationRepository.findMaterialSpecializationById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Material specialization not found."));
        }

        const normalized = normalizeMaterialSpecialization(req.body as MaterialSpecializationInput);
        if (normalized.error) {
            await transaction.rollback();
            return next(new HttpException(400, normalized.error));
        }

        await materialSpecializationRepository.updateMaterialSpecializationById(
            id,
            normalized.data!,
            transaction,
        );

        const updated = await materialSpecializationRepository.findMaterialSpecializationById(id, transaction);
        await transaction.commit();

        return res.status(200).json({
            message: "Material specialization updated successfully",
            data: updated,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const saveMaterialSpecializations = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const items = Array.isArray(req.body)
            ? (req.body as MaterialSpecializationInput[])
            : Array.isArray((req.body as { items?: unknown })?.items)
              ? ((req.body as { items: MaterialSpecializationInput[] }).items)
              : null;

        if (!items) {
            await transaction.rollback();
            return next(new HttpException(400, "Material specializations array is required."));
        }

        const existingMaterials = await materialSpecializationRepository.findAllMaterialSpecializations();
        const rows = [];
        for (const [index, item] of items.entries()) {
            const normalized = normalizeMaterialSpecialization(item, index);
            if (normalized.error) {
                await transaction.rollback();
                return next(new HttpException(400, normalized.error));
            }
            rows.push(normalized.data!);
        }

        const nextPublicUrls = extractPublicUrls(rows);
        const removedPublicUrls = existingMaterials
            .map(material => material.public_url?.trim())
            .filter((value): value is string => Boolean(value) && !nextPublicUrls.has(value));

        await materialSpecializationRepository.deleteAllMaterialSpecializations(transaction);
        if (rows.length > 0) {
            await materialSpecializationRepository.bulkCreateMaterialSpecializations(rows, transaction);
        }

        await transaction.commit();
        if (removedPublicUrls.length > 0) {
            await Promise.all(removedPublicUrls.map(publicUrl => imageService.deleteImage(publicUrl)));
        }
        return res.status(201).json({
            message: "Material specializations saved successfully",
            data: { count: rows.length },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllMaterialSpecializations = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const materials = await materialSpecializationRepository.findAllMaterialSpecializations();
        return res.status(200).json({ data: materials });
    } catch (error) {
        return next(error as Error);
    }
};

const deleteMaterialSpecialization = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid material specialization id."));
        }

        const material = await materialSpecializationRepository.findMaterialSpecializationById(id, transaction);
        if (!material) {
            await transaction.rollback();
            return next(new HttpException(404, "Material specialization not found."));
        }

        await materialSpecializationRepository.deleteMaterialSpecializationById(id, transaction);
        await transaction.commit();
        if (material.public_url) {
            await imageService.deleteImage(material.public_url);
        }
        return res.status(200).json({ message: "Material specialization deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default {
    createMaterialSpecialization,
    updateMaterialSpecialization,
    saveMaterialSpecializations,
    getAllMaterialSpecializations,
    deleteMaterialSpecialization,
};
