import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import journeyTimelineRepository from "../repository/journey-timeline.repository";

type JourneyTimelineInput = {
    year: number | string;
    title: string;
    description: string;
};

const extractItems = (req: Request): JourneyTimelineInput[] | null => {
    if (Array.isArray(req.body)) {
        return req.body as JourneyTimelineInput[];
    }
    if (req.body && Array.isArray((req.body as { items?: unknown }).items)) {
        return (req.body as { items: JourneyTimelineInput[] }).items;
    }
    return null;
};

const validateItems = (items: JourneyTimelineInput[]) => {
    if (items.length === 0) {
        return "At least one timeline item is required.";
    }
    for (const [index, item] of items.entries()) {
        if (!item) {
            return `Timeline item at index ${index} is invalid.`;
        }
        const yearNumber =
            item.year === undefined || item.year === null || item.year === ""
                ? NaN
                : Number(item.year);
        if (Number.isNaN(yearNumber)) {
            return `Timeline item at index ${index} has invalid year.`;
        }
        if (!item.title) {
            return `Timeline item at index ${index} is missing title.`;
        }
        if (!item.description) {
            return `Timeline item at index ${index} is missing description.`;
        }
    }
    return null;
};

const createJourneyTimeline = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const items = extractItems(req);
        if (!items) {
            await transaction.rollback();
            return next(new HttpException(400, "Timeline items array is required."));
        }

        const validationError = validateItems(items);
        if (validationError) {
            await transaction.rollback();
            return next(new HttpException(400, validationError));
        }

        const rows = items.map(item => ({
            year: Number(item.year),
            title: item.title,
            description: item.description,
        }));

        await journeyTimelineRepository.deleteAllJourneyTimeline(transaction);
        await journeyTimelineRepository.bulkCreateJourneyTimeline(rows, transaction);

        await transaction.commit();
        return res.status(201).json({
            message: "Journey timeline saved successfully",
            data: { count: rows.length },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getJourneyTimeline = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const items = await journeyTimelineRepository.findAllJourneyTimeline();
        return res.status(200).json({ data: items });
    } catch (error) {
        return next(error as Error);
    }
};

export default { createJourneyTimeline, getJourneyTimeline };
