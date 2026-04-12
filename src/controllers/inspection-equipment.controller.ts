import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import inspectionEquipmentRepository from "../repository/inspection-equipment.repository";

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

type InspectionEquipmentInput = {
    title?: string;
    icon_name?: string | null;
    measurement?: string;
    accuracy?: string;
    application?: unknown;
};

const normalizeApplication = (value: unknown) => {
    const application = parseJsonField<unknown[]>(value, []);
    if (!Array.isArray(application)) {
        return { error: "application must be an array of strings." as const };
    }
    const normalized = application.map(item => String(item ?? "").trim()).filter(Boolean);
    return { data: normalized };
};

const getAllInspectionEquipment = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await inspectionEquipmentRepository.findAllInspectionEquipment();
        return res.status(200).json({ data: items });
    } catch (error) {
        return next(error as Error);
    }
};

const createInspectionEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const body = req.body as InspectionEquipmentInput;

        if (!body.title || !body.title.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "title is required."));
        }
        if (!body.measurement || !body.measurement.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "measurement is required."));
        }
        if (!body.accuracy || !body.accuracy.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "accuracy is required."));
        }

        const normalizedApp = normalizeApplication(body.application);
        if ("error" in normalizedApp) {
            await transaction.rollback();
            return next(new HttpException(400, normalizedApp.error));
        }

        const row = await inspectionEquipmentRepository.createInspectionEquipment(
            {
                title: body.title.trim(),
                icon_name: body.icon_name?.trim() || null,
                measurement: body.measurement.trim(),
                accuracy: body.accuracy.trim(),
                application: normalizedApp.data,
            },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Inspection equipment created successfully",
            data: { id: row.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateInspectionEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid inspection equipment id."));
        }

        const existing = await inspectionEquipmentRepository.findInspectionEquipmentById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Inspection equipment not found."));
        }

        const body = req.body as InspectionEquipmentInput;
        const updates: {
            title?: string;
            icon_name?: string | null;
            measurement?: string;
            accuracy?: string;
            application?: string[];
            updated_at?: Date;
        } = {};

        if (Object.prototype.hasOwnProperty.call(body, "title")) {
            if (!body.title || !body.title.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "title cannot be empty."));
            }
            updates.title = body.title.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "icon_name")) {
            updates.icon_name = body.icon_name?.trim() || null;
        }

        if (Object.prototype.hasOwnProperty.call(body, "measurement")) {
            if (!body.measurement || !body.measurement.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "measurement cannot be empty."));
            }
            updates.measurement = body.measurement.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "accuracy")) {
            if (!body.accuracy || !body.accuracy.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "accuracy cannot be empty."));
            }
            updates.accuracy = body.accuracy.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "application")) {
            const normalizedApp = normalizeApplication(body.application);
            if ("error" in normalizedApp) {
                await transaction.rollback();
                return next(new HttpException(400, normalizedApp.error));
            }
            updates.application = normalizedApp.data;
        }

        if (Object.keys(updates).length === 0) {
            await transaction.rollback();
            return next(new HttpException(400, "No valid fields provided to update."));
        }

        updates.updated_at = new Date();
        await inspectionEquipmentRepository.updateInspectionEquipmentById(id, updates, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Inspection equipment updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteInspectionEquipment = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid inspection equipment id."));
        }

        const existing = await inspectionEquipmentRepository.findInspectionEquipmentById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Inspection equipment not found."));
        }

        await inspectionEquipmentRepository.deleteInspectionEquipmentById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Inspection equipment deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default {
    getAllInspectionEquipment,
    createInspectionEquipment,
    updateInspectionEquipment,
    deleteInspectionEquipment,
};

