import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import manufacturingInfrastructureRepository from "../repository/manufacturing-infrastructure.repository";

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

type ManufacturingInfrastructureInput = {
    title?: string;
    description?: string | null;
    points?: unknown;
};

const normalizePoints = (pointsValue: unknown) => {
    const points = parseJsonField<unknown[]>(pointsValue, []);
    if (!Array.isArray(points)) {
        return { error: "points must be an array of strings." as const };
    }
    const normalized = points.map(value => String(value ?? "").trim()).filter(Boolean);
    return { data: normalized };
};

const getAllManufacturingInfrastructures = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const infrastructures =
            await manufacturingInfrastructureRepository.findAllManufacturingInfrastructures();
        return res.status(200).json({ data: infrastructures });
    } catch (error) {
        return next(error as Error);
    }
};

const createManufacturingInfrastructure = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { title, description, points } = req.body as ManufacturingInfrastructureInput;

        if (!title || !title.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "title is required."));
        }

        if (!description || !description.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "description is required."));
        }

        const normalizedPoints = normalizePoints(points);
        if ("error" in normalizedPoints) {
            await transaction.rollback();
            return next(new HttpException(400, normalizedPoints.error));
        }

        if (normalizedPoints.data.length === 0) {
            await transaction.rollback();
            return next(new HttpException(400, "At least 1 point is required."));
        }

        const row = await manufacturingInfrastructureRepository.createManufacturingInfrastructure(
            {
                title: title.trim(),
                description: description.trim(),
                points: normalizedPoints.data,
            },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Manufacturing infrastructure created successfully",
            data: { id: row.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateManufacturingInfrastructure = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid manufacturing infrastructure id."));
        }

        const existing = await manufacturingInfrastructureRepository.findManufacturingInfrastructureById(
            id,
            transaction,
        );
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Manufacturing infrastructure not found."));
        }

        const body = req.body as ManufacturingInfrastructureInput;
        const updates: { title?: string; description?: string | null; points?: string[]; updated_at?: Date } =
            {};

        if (Object.prototype.hasOwnProperty.call(body, "title")) {
            if (!body.title || !body.title.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "title cannot be empty."));
            }
            updates.title = body.title.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "description")) {
            if (!body.description || !body.description.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "description cannot be empty."));
            }
            updates.description = body.description.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "points")) {
            const normalizedPoints = normalizePoints(body.points);
            if ("error" in normalizedPoints) {
                await transaction.rollback();
                return next(new HttpException(400, normalizedPoints.error));
            }
            if (normalizedPoints.data.length === 0) {
                await transaction.rollback();
                return next(new HttpException(400, "At least 1 point is required."));
            }
            updates.points = normalizedPoints.data;
        }

        if (Object.keys(updates).length === 0) {
            await transaction.rollback();
            return next(new HttpException(400, "No valid fields provided to update."));
        }

        updates.updated_at = new Date();
        await manufacturingInfrastructureRepository.updateManufacturingInfrastructureById(
            id,
            updates,
            transaction,
        );

        await transaction.commit();
        return res.status(200).json({ message: "Manufacturing infrastructure updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteManufacturingInfrastructure = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid manufacturing infrastructure id."));
        }

        const existing = await manufacturingInfrastructureRepository.findManufacturingInfrastructureById(
            id,
            transaction,
        );
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Manufacturing infrastructure not found."));
        }

        await manufacturingInfrastructureRepository.deleteManufacturingInfrastructureById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Manufacturing infrastructure deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default {
    getAllManufacturingInfrastructures,
    createManufacturingInfrastructure,
    updateManufacturingInfrastructure,
    deleteManufacturingInfrastructure,
};
