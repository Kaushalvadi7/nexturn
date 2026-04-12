import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import clientProblemSolvingRepository from "../repository/client-problem-solving.repository";

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

type ClientProblemSolvingInput = {
    client_name?: string;
    product_name?: string;
    client_location?: string;
    year?: number | string;
    challange?: string | null;
    solution?: string | null;
    results?: unknown;
};

const normalizeResults = (resultsValue: unknown) => {
    const results = parseJsonField<unknown[]>(resultsValue, []);
    if (!Array.isArray(results)) {
        return { error: "results must be an array of strings." as const };
    }
    const normalized = results.map(value => String(value ?? "").trim()).filter(Boolean);
    return { data: normalized };
};

const getAllClientProblemSolving = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await clientProblemSolvingRepository.findAllClientProblemSolving();
        return res.status(200).json({ data: items });
    } catch (error) {
        return next(error as Error);
    }
};

const createClientProblemSolving = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const body = req.body as ClientProblemSolvingInput;

        if (!body.client_name || !body.client_name.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "client_name is required."));
        }
        if (!body.product_name || !body.product_name.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "product_name is required."));
        }
        if (!body.client_location || !body.client_location.trim()) {
            await transaction.rollback();
            return next(new HttpException(400, "client_location is required."));
        }

        const year =
            body.year === undefined || body.year === null || body.year === ""
                ? null
                : Number(body.year);
        if (year === null || Number.isNaN(year)) {
            await transaction.rollback();
            return next(new HttpException(400, "year is required and must be a number."));
        }

        const normalizedResults = normalizeResults(body.results);
        if ("error" in normalizedResults) {
            await transaction.rollback();
            return next(new HttpException(400, normalizedResults.error));
        }

        const row = await clientProblemSolvingRepository.createClientProblemSolving(
            {
                client_name: body.client_name.trim(),
                product_name: body.product_name.trim(),
                client_location: body.client_location.trim(),
                year,
                challange: body.challange?.trim() || null,
                solution: body.solution?.trim() || null,
                results: normalizedResults.data,
            },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Client problem solving entry created successfully",
            data: { id: row.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const updateClientProblemSolving = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid client problem solving id."));
        }

        const existing = await clientProblemSolvingRepository.findClientProblemSolvingById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Client problem solving entry not found."));
        }

        const body = req.body as ClientProblemSolvingInput;
        const updates: {
            client_name?: string;
            product_name?: string;
            client_location?: string;
            year?: number;
            challange?: string | null;
            solution?: string | null;
            results?: string[];
            updated_at?: Date;
        } = {};

        if (Object.prototype.hasOwnProperty.call(body, "client_name")) {
            if (!body.client_name || !body.client_name.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "client_name cannot be empty."));
            }
            updates.client_name = body.client_name.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "product_name")) {
            if (!body.product_name || !body.product_name.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "product_name cannot be empty."));
            }
            updates.product_name = body.product_name.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "client_location")) {
            if (!body.client_location || !body.client_location.trim()) {
                await transaction.rollback();
                return next(new HttpException(400, "client_location cannot be empty."));
            }
            updates.client_location = body.client_location.trim();
        }

        if (Object.prototype.hasOwnProperty.call(body, "year")) {
            const year =
                body.year === undefined || body.year === null || body.year === ""
                    ? null
                    : Number(body.year);
            if (year === null || Number.isNaN(year)) {
                await transaction.rollback();
                return next(new HttpException(400, "year must be a number."));
            }
            updates.year = year;
        }

        if (Object.prototype.hasOwnProperty.call(body, "challange")) {
            updates.challange = body.challange?.trim() || null;
        }

        if (Object.prototype.hasOwnProperty.call(body, "solution")) {
            updates.solution = body.solution?.trim() || null;
        }

        if (Object.prototype.hasOwnProperty.call(body, "results")) {
            const normalizedResults = normalizeResults(body.results);
            if ("error" in normalizedResults) {
                await transaction.rollback();
                return next(new HttpException(400, normalizedResults.error));
            }
            updates.results = normalizedResults.data;
        }

        if (Object.keys(updates).length === 0) {
            await transaction.rollback();
            return next(new HttpException(400, "No valid fields provided to update."));
        }

        updates.updated_at = new Date();
        await clientProblemSolvingRepository.updateClientProblemSolvingById(id, updates, transaction);

        await transaction.commit();
        return res.status(200).json({ message: "Client problem solving entry updated successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteClientProblemSolving = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid client problem solving id."));
        }

        const existing = await clientProblemSolvingRepository.findClientProblemSolvingById(id, transaction);
        if (!existing) {
            await transaction.rollback();
            return next(new HttpException(404, "Client problem solving entry not found."));
        }

        await clientProblemSolvingRepository.deleteClientProblemSolvingById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Client problem solving entry deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default {
    getAllClientProblemSolving,
    createClientProblemSolving,
    updateClientProblemSolving,
    deleteClientProblemSolving,
};

