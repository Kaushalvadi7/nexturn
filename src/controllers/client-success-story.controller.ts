import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import clientSuccessStoryRepository from "../repository/client-success-story.repository";

const createClientSuccessStory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const {
            stars,
            client_name,
            client_position,
            client_city,
            description,
            client_purchase,
        } = req.body as {
            stars?: number | string;
            client_name?: string;
            client_position?: string;
            client_city?: string;
            description?: string;
            client_purchase?: string;
        };

        if (!client_name) {
            await transaction.rollback();
            return next(new HttpException(400, "Client name is required."));
        }

        const starsNumber =
            stars === undefined || stars === null || stars === ""
                ? null
                : Number(stars);

        if (starsNumber !== null && (Number.isNaN(starsNumber) || starsNumber < 0 || starsNumber > 5)) {
            await transaction.rollback();
            return next(new HttpException(400, "Stars must be a number between 0 and 5."));
        }

        const story = await clientSuccessStoryRepository.createClientSuccessStory(
            {
                stars: starsNumber,
                client_name,
                client_position: client_position ?? null,
                client_city: client_city ?? null,
                description: description ?? null,
                client_purchase: client_purchase ?? null,
            },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Client success story created successfully",
            data: { id: story.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteClientSuccessStory = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid client success story id."));
        }

        const story = await clientSuccessStoryRepository.findClientSuccessStoryById(id, transaction);
        if (!story) {
            await transaction.rollback();
            return next(new HttpException(404, "Client success story not found."));
        }

        await clientSuccessStoryRepository.deleteClientSuccessStoryById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Client success story deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllClientSuccessStories = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const stories = await clientSuccessStoryRepository.findAllClientSuccessStories();
        return res.status(200).json({ data: stories });
    } catch (error) {
        return next(error as Error);
    }
};

export default { createClientSuccessStory, deleteClientSuccessStory, getAllClientSuccessStories };
