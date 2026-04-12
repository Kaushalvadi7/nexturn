import { NextFunction, Request, Response } from "express";
import { UniqueConstraintError } from "sequelize";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import regionRepository from "../repository/region.repository";

const normalizeCountryCode = (value: unknown) => String(value || "").trim().toUpperCase();
const normalizeStateName = (value: unknown) => String(value || "").trim();

const resolveCountryLabel = (countryCode: string) => {
    try {
        const displayNames = new Intl.DisplayNames(["en"], { type: "region" });
        const resolved = displayNames.of(countryCode);
        return resolved && resolved !== countryCode ? resolved : countryCode;
    } catch {
        return countryCode;
    }
};

const createRegion = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { country_code, state_name } = req.body as {
            country_code?: string;
            state_name?: string;
        };
        const countryCode = normalizeCountryCode(country_code);
        const stateName = normalizeStateName(state_name);

        if (!/^[A-Z]{2}$/.test(countryCode)) {
            await transaction.rollback();
            return next(new HttpException(400, "Valid country_code is required."));
        }

        const existingCountry = await regionRepository.findRegionByCountryCode(countryCode, transaction);
        if (existingCountry) {
            await transaction.rollback();
            return next(new HttpException(409, "Region already exists for this country."));
        }

        const region = await regionRepository.createRegion(
            {
                country_code: countryCode,
                // Keep legacy column populated while the UI is country-only.
                state_name: stateName || resolveCountryLabel(countryCode),
            },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Region created successfully",
            data: { id: region.id },
        });
    } catch (error) {
        await transaction.rollback();
        if (error instanceof UniqueConstraintError) {
            return next(new HttpException(409, "Region already exists for this country."));
        }
        return next(error as Error);
    }
};

const getAllRegions = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const regions = await regionRepository.findAllRegions();
        return res.status(200).json({ data: regions });
    } catch (error) {
        return next(error as Error);
    }
};

const deleteRegion = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid region id."));
        }

        const region = await regionRepository.findRegionById(id, transaction);
        if (!region) {
            await transaction.rollback();
            return next(new HttpException(404, "Region not found."));
        }

        await regionRepository.deleteRegionById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Region deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

export default { createRegion, getAllRegions, deleteRegion };
