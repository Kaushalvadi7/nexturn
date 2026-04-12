import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import manufacturingCapabilityRepository from "../repository/manufacturing-capability.repository";

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

type ManufacturingCapabilityInput = {
    title?: string;
    description?: string | null;
    feature?: unknown;
    sort_order?: number | string | null;
    is_active?: boolean | string | null;
    icon_name?: string | null;
};

const normalizeCapabilityInput = (item: ManufacturingCapabilityInput, index?: number) => {
    if (!item?.title) {
        return { error: `Manufacturing capability${index !== undefined ? ` at index ${index}` : ""} is missing title.` };
    }

    if (!item?.description || !String(item.description).trim()) {
        return {
            error: `Manufacturing capability${index !== undefined ? ` at index ${index}` : ""} is missing description.`,
        };
    }

    if (!item?.icon_name || !String(item.icon_name).trim()) {
        return {
            error: `Manufacturing capability${index !== undefined ? ` at index ${index}` : ""} is missing icon_name.`,
        };
    }

    const feature = parseJsonField<string[]>(item.feature, []);
    if (!Array.isArray(feature)) {
        return {
            error: `Manufacturing capability${index !== undefined ? ` at index ${index}` : ""} has invalid feature list.`,
        };
    }

    const normalizedFeature = feature
        .map(value => String(value ?? "").trim())
        .filter(Boolean);

    if (normalizedFeature.length === 0) {
        return {
            error: `Manufacturing capability${index !== undefined ? ` at index ${index}` : ""} must include at least 1 feature.`,
        };
    }

    const sortOrder =
        item.sort_order === undefined || item.sort_order === null || item.sort_order === ""
            ? null
            : Number(item.sort_order);

    if (sortOrder !== null && Number.isNaN(sortOrder)) {
        return {
            error: `Manufacturing capability${index !== undefined ? ` at index ${index}` : ""} has invalid sort_order.`,
        };
    }

    const isActive =
        item.is_active === undefined || item.is_active === null || item.is_active === ""
            ? null
            : String(item.is_active).toLowerCase() === "true";

    return {
        data: {
            title: item.title.trim(),
            description: String(item.description).trim(),
            feature: normalizedFeature,
            icon_name: String(item.icon_name).trim(),
            sort_order: sortOrder,
            is_active: isActive,
        },
    };
};

const createManufacturingCapability = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const normalized = normalizeCapabilityInput(req.body as ManufacturingCapabilityInput);
        if (normalized.error) {
            await transaction.rollback();
            return next(new HttpException(400, normalized.error));
        }

        const capability = await manufacturingCapabilityRepository.createManufacturingCapability(
            normalized.data!,
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Manufacturing capability created successfully",
            data: capability,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateManufacturingCapability = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid manufacturing capability id."));
        }

        const existing = await manufacturingCapabilityRepository.findManufacturingCapabilityById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Manufacturing capability not found."));
        }

        const normalized = normalizeCapabilityInput(req.body as ManufacturingCapabilityInput);
        if (normalized.error) {
            await transaction.rollback();
            return next(new HttpException(400, normalized.error));
        }

        await manufacturingCapabilityRepository.updateManufacturingCapabilityById(
            id,
            { ...normalized.data!, updated_at: new Date() },
            transaction,
        );

        const updated = await manufacturingCapabilityRepository.findManufacturingCapabilityById(id, transaction);

        await transaction.commit();
        return res.status(200).json({
            message: "Manufacturing capability updated successfully",
            data: updated,
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const saveManufacturingCapabilities = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const items = Array.isArray(req.body)
            ? (req.body as ManufacturingCapabilityInput[])
            : Array.isArray((req.body as { items?: unknown })?.items)
              ? ((req.body as { items: ManufacturingCapabilityInput[] }).items)
              : null;

        if (!items) {
            await transaction.rollback();
            return next(new HttpException(400, "Manufacturing capabilities array is required."));
        }

        const rows = [];
        for (const [index, item] of items.entries()) {
            const normalized = normalizeCapabilityInput(item, index);
            if (normalized.error) {
                await transaction.rollback();
                return next(new HttpException(400, normalized.error));
            }
            rows.push({
                ...normalized.data!,
                sort_order: normalized.data!.sort_order ?? index + 1,
            });
        }

        await manufacturingCapabilityRepository.deleteAllManufacturingCapabilities(transaction);
        if (rows.length > 0) {
            await manufacturingCapabilityRepository.bulkCreateManufacturingCapabilities(rows, transaction);
        }

        await transaction.commit();
        return res.status(201).json({
            message: "Manufacturing capabilities saved successfully",
            data: { count: rows.length },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteManufacturingCapability = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid manufacturing capability id."));
        }

        const capability = await manufacturingCapabilityRepository.findManufacturingCapabilityById(id, transaction);
        if (!capability) {
            await transaction.rollback();
            return next(new HttpException(404, "Manufacturing capability not found."));
        }

        await manufacturingCapabilityRepository.deleteManufacturingCapabilityById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Manufacturing capability deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllManufacturingCapabilities = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const capabilities = await manufacturingCapabilityRepository.findAllManufacturingCapabilities();
        return res.status(200).json({ data: capabilities });
    } catch (error) {
        return next(error as Error);
    }
};

export default {
    createManufacturingCapability,
    updateManufacturingCapability,
    saveManufacturingCapabilities,
    deleteManufacturingCapability,
    getAllManufacturingCapabilities,
};
