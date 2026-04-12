import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import infoTableRepository from "../repository/performance-metrices.repository";

const normalizeOptionalString = (value?: string | null) => {
    if (value === undefined || value === null) return undefined;
    const trimmed = String(value).trim();
    return trimmed === "" ? null : trimmed;
};

const parseBoolean = (value: unknown) => {
    if (value === undefined || value === null || value === "") {
        return undefined;
    }
    return String(value).toLowerCase() === "true";
};

const createInfoTable = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { field, value, icon_name, view_in_hero_page, view_in_about_us } = req.body as {
            field?: string;
            value?: string;
            icon_name?: string | null;
            view_in_hero_page?: boolean | string;
            view_in_about_us?: boolean | string;
        };

        if (!field) {
            await transaction.rollback();
            return next(new HttpException(400, "field is required."));
        }
        if (!value) {
            await transaction.rollback();
            return next(new HttpException(400, "value is required."));
        }

        const created = await infoTableRepository.createInfoTable(
            {
                field: String(field).trim(),
                value: String(value).trim(),
                icon_name: normalizeOptionalString(icon_name),
                view_in_hero_page: parseBoolean(view_in_hero_page) ?? false,
                view_in_about_us: parseBoolean(view_in_about_us) ?? false,
            },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Info record created successfully",
            data: { id: created.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateInfoTable = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid info_table id."));
        }

        const existing = await infoTableRepository.findInfoTableById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Info record not found."));
        }

        const { field, value, icon_name, view_in_hero_page, view_in_about_us } = req.body as {
            field?: string;
            value?: string;
            icon_name?: string | null;
            view_in_hero_page?: boolean | string;
            view_in_about_us?: boolean | string;
        };

        const updates: {
            field?: string;
            value?: string;
            icon_name?: string | null;
            view_in_hero_page?: boolean;
            view_in_about_us?: boolean;
            updated_at?: Date;
        } = {};

        if (field !== undefined) {
            const normalized = String(field).trim();
            if (!normalized) {
                await transaction.rollback();
                return next(new HttpException(400, "field cannot be empty."));
            }
            updates.field = normalized;
        }

        if (value !== undefined) {
            const normalized = String(value).trim();
            if (!normalized) {
                await transaction.rollback();
                return next(new HttpException(400, "value cannot be empty."));
            }
            updates.value = normalized;
        }

        if (icon_name !== undefined) {
            updates.icon_name = normalizeOptionalString(icon_name);
        }

        const parsedViewInHero = parseBoolean(view_in_hero_page);
        if (parsedViewInHero !== undefined) {
            updates.view_in_hero_page = parsedViewInHero;
        }

        const parsedViewInAboutUs = parseBoolean(view_in_about_us);
        if (parsedViewInAboutUs !== undefined) {
            updates.view_in_about_us = parsedViewInAboutUs;
        }

        if (Object.keys(updates).length > 0) {
            updates.updated_at = new Date();
            await infoTableRepository.updateInfoTableById(id, updates, transaction);
        }

        await transaction.commit();
        return res.status(200).json({ message: "Info record updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteInfoTable = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid info_table id."));
        }

        const existing = await infoTableRepository.findInfoTableById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Info record not found."));
        }

        await infoTableRepository.deleteInfoTableById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Info record deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllInfoTable = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const records = await infoTableRepository.findAllInfoTable();
        return res.status(200).json({ data: records });
    } catch (error) {
        return next(error as Error);
    }
};

export default {
    createInfoTable,
    updateInfoTable,
    deleteInfoTable,
    getAllInfoTable,
};
