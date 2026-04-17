import { NextFunction, Request, Response } from "express";
import HttpException from "../exceptions/HttpException";
import companyStatRepository from "../repository/company-stat.repository";
import companyProfileDownloadRepository from "../repository/company-profile-download.repository";

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

        if (asset === "company_profile") {
            await companyProfileDownloadRepository.createCompanyProfileDownload({
                name: String(name).trim(),
                email: String(email).trim(),
                created_at: new Date(),
            });
        }

        return res.status(201).json({ message: "Download lead captured" });
    } catch (error) {
        return next(error as Error);
    }
};

const parsePositiveInt = (value: string | undefined, fallback: number) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
    return Math.floor(parsed);
};

const parseDateAtDayStart = (value?: string) => {
    if (!value) return null;
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
};

const parseDateAtDayEnd = (value?: string) => {
    if (!value) return null;
    const parsed = new Date(`${value}T23:59:59.999Z`);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
};

const getCompanyProfileDownloads = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parsePositiveInt(String(req.query.page || ""), 1);
        const limit = Math.min(parsePositiveInt(String(req.query.limit || ""), 50), 100);

        const email = String(req.query.email || "").trim();
        const startDateRaw = String(req.query.startDate || "").trim();
        const endDateRaw = String(req.query.endDate || "").trim();

        const startDate = parseDateAtDayStart(startDateRaw || undefined);
        const endDate = parseDateAtDayEnd(endDateRaw || undefined);

        if (startDateRaw && !startDate) {
            return next(new HttpException(400, "Invalid startDate. Use YYYY-MM-DD format."));
        }
        if (endDateRaw && !endDate) {
            return next(new HttpException(400, "Invalid endDate. Use YYYY-MM-DD format."));
        }
        if (startDate && endDate && startDate > endDate) {
            return next(new HttpException(400, "startDate cannot be after endDate."));
        }

        const { rows, count } = await companyProfileDownloadRepository.findCompanyProfileDownloads({
            email: email || undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
            page,
            limit,
        });

        return res.status(200).json({
            data: rows.map((item) => item.toJSON()),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        });
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

export default { createDownloadLead, downloadAsset, getCompanyProfileDownloads };
