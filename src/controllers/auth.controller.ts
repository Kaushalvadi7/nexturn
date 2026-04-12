import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminRepository from "../repository/admin.repository";
import { BCRYPT_PEPPER, COOKIE_SAME_SITE, COOKIE_SECURE, JWT_SECRET, NODE_ENV } from "../config";
import HttpException from "../exceptions/HttpException";

const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const COOKIE_NAME = "admin_token";
const IS_PRODUCTION = NODE_ENV === "production";
const PASSWORD_HASH_ROUNDS = 12;
const parseBoolean = (value: string | undefined): boolean | undefined => {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") return true;
    if (normalized === "false") return false;
    return undefined;
};
const normalizeSameSite = (
    value: string | undefined,
): "strict" | "lax" | "none" => {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "strict" || normalized === "lax" || normalized === "none") {
        return normalized;
    }
    return IS_PRODUCTION ? "none" : "lax";
};
const cookieSameSite = normalizeSameSite(COOKIE_SAME_SITE);
const cookieSecure = parseBoolean(COOKIE_SECURE) ?? (cookieSameSite === "none" ? true : IS_PRODUCTION);

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body as {
            email?: string;
            password?: string;
        };

        if (!email || !password) {
            return next(new HttpException(400, "Email and password are required."));
        }

        if (!JWT_SECRET) {
            return next(new HttpException(500, "JWT secret is not configured."));
        }

        const admin = await adminRepository.findByEmail(email);
        if (!admin) {
            return next(new HttpException(401, "Invalid email or password."));
        }

        const pepper = BCRYPT_PEPPER || "";
        const isValid = await bcrypt.compare(password + pepper, admin.password_hash);
        if (!isValid) {
            return next(new HttpException(401, "Invalid email or password."));
        }

        const token = jwt.sign({ adminId: admin.id, role: "admin" }, JWT_SECRET, { expiresIn: "24h" });

        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: cookieSameSite,
            secure: cookieSecure,
            path: "/",
            maxAge: ONE_DAY_MS,
        });

        return res.status(200).json({ message: "Admin logged in successfully" });
    } catch (error) {
        return next(error as Error);
    }
};

const logout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie(COOKIE_NAME, {
            httpOnly: true,
            sameSite: cookieSameSite,
            secure: cookieSecure,
            path: "/",
        });
        return res.status(200).json({ message: "Admin logged out successfully" });
    } catch (error) {
        return next(error as Error);
    }
};

const me = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user?.adminId) {
            return next(new HttpException(401, "Unauthorized."));
        }

        const admin = await adminRepository.findById(req.user.adminId);
        if (!admin) {
            return next(new HttpException(401, "Unauthorized."));
        }

        return res.status(200).json({
            id: admin.id,
            email: admin.email,
            name: admin.name || null,
            role: "admin",
        });
    } catch (error) {
        return next(error as Error);
    }
};

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body as {
            email?: string;
            password?: string;
            name?: string;
        };

        const totalAdmins = await adminRepository.countAdmins();
        if (totalAdmins >= 1) {
            return next(
                new HttpException(
                    409,
                    "An admin already exists. Delete the existing admin before creating a new one.",
                ),
            );
        }

        const normalizedEmail = String(email || "").trim().toLowerCase();
        const normalizedName = String(name || "").trim();

        if (!normalizedEmail || !password) {
            return next(new HttpException(400, "Email and password are required."));
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            return next(new HttpException(400, "Invalid email format."));
        }

        if (String(password).length < 8) {
            return next(new HttpException(400, "Password must be at least 8 characters long."));
        }

        const existing = await adminRepository.findByEmail(normalizedEmail);
        if (existing) {
            return next(new HttpException(409, "An admin with this email already exists."));
        }

        const pepper = BCRYPT_PEPPER || "";
        const password_hash = await bcrypt.hash(String(password) + pepper, PASSWORD_HASH_ROUNDS);

        const created = await adminRepository.createAdmin({
            email: normalizedEmail,
            password_hash,
            name: normalizedName || null,
        });

        return res.status(201).json({
            id: created.id,
            email: created.email,
            name: created.name || null,
            role: "admin",
            message: "Admin created successfully.",
        });
    } catch (error) {
        return next(error as Error);
    }
};

const deleteAdminByEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const existing = await adminRepository.findAnyAdmin();
        if (!existing) {
            return next(new HttpException(404, "Admin not found."));
        }
        const existingEmail = String(existing.email || "").trim().toLowerCase();
        await adminRepository.deleteByEmail(existingEmail);

        return res.status(200).json({
            message: "Admin deleted successfully.",
            email: existingEmail,
        });
    } catch (error) {
        return next(error as Error);
    }
};

export default { login, logout, me, createAdmin, deleteAdminByEmail };
