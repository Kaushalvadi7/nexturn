import { NextFunction, Request, Response } from "express";
import db from "../models";
import HttpException from "../exceptions/HttpException";
import certificateRepository from "../repository/certificate.repository";

const createCertificate = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const { name } = req.body as { name?: string };
        if (!name) {
            await transaction.rollback();
            return next(new HttpException(400, "Name is required."));
        }

        const certificate = await certificateRepository.createCertificate(
            { name },
            transaction,
        );

        await transaction.commit();
        return res.status(201).json({
            message: "Certificate created successfully",
            data: { id: certificate.id },
        });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const deleteCertificate = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await db.transaction();
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            await transaction.rollback();
            return next(new HttpException(400, "Invalid certificate id."));
        }

        const certificate = await certificateRepository.findCertificateById(id, transaction);
        if (!certificate) {
            await transaction.rollback();
            return next(new HttpException(404, "Certificate not found."));
        }

        await certificateRepository.deleteCertificateById(id, transaction);
        await transaction.commit();
        return res.status(200).json({ message: "Certificate deleted successfully" });
    } catch (error) {
        await transaction.rollback();
        return next(error as Error);
    }
};

const getAllCertificates = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const certificates = await certificateRepository.findAllCertificates();
        return res.status(200).json({ data: certificates });
    } catch (error) {
        return next(error as Error);
    }
};

export default { createCertificate, deleteCertificate, getAllCertificates };
