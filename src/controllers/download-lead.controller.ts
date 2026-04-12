import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import emailService from "../services/email.service";
import logger from "../utils/logger";
import companyStatRepository from "../repository/company-stat.repository";

const isValidEmail = (value?: string) => {
    const email = String(value || "").trim();
    if (!email) return false;
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

const isValidAsset = (value?: string) => {
    return value === "catalogue" || value === "company_profile";
};

const createDownloadLead = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, asset } = req.body as {
            name?: string;
            email?: string;
            asset?: "catalogue" | "company_profile" | string;
        };

        if (!name || !String(name).trim()) {
            return next(new HttpException(400, "name is required."));
        }
        if (!email || !isValidEmail(email)) {
            return next(new HttpException(400, "A valid email is required."));
        }
        if (!asset || !isValidAsset(asset)) {
            return next(new HttpException(400, "asset must be 'catalogue' or 'company_profile'."));
        }

        // Send email in background so API response is not blocked by SMTP latency.
        void emailService
            .sendDownloadLeadNotification(
                {
                    name: String(name).trim(),
                    email: String(email).trim(),
                    asset: asset as "catalogue" | "company_profile",
                },
                {
                    ip: req.ip,
                    userAgent: req.headers["user-agent"],
                    referer: req.headers.referer,
                },
            )
            .catch((error) => {
                logger.error("Failed to send download lead notification email", { error });
            });

        return res.status(201).json({ message: "Download lead captured" });
    } catch (error) {
        return next(error as Error);
    }
};

const downloadAsset = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const asset = String(req.query.asset || "").trim();
        if (asset !== "company_profile") {
            return next(new HttpException(400, "Unsupported asset. Use asset=company_profile."));
        }

        const row = await companyStatRepository.findByKey(
            companyStatRepository.CONTACT_COMPANY_PROFILE_KEY,
        );
        const fileUrl = String(row?.value || "").trim();
        if (!fileUrl) {
            return next(new HttpException(404, "Company profile file is not available."));
        }

        const response = await fetch(fileUrl);
        if (!response.ok) {
            return next(new HttpException(502, "Failed to fetch company profile file."));
        }

        const contentType = response.headers.get("content-type") || "application/pdf";
        const fileBuffer = Buffer.from(await response.arrayBuffer());

        res.setHeader("Content-Type", contentType);
        res.setHeader("Content-Disposition", 'attachment; filename="company-profile.pdf"');
        return res.status(200).send(fileBuffer);
    } catch (error) {
        return next(error as Error);
    }
};

export default { createDownloadLead, downloadAsset };
