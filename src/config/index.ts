import { config } from "dotenv";
config({ path: `.env` });

export const {
    NODE_ENV,
    PORT,
    CORS_ALLOWED_ORIGINS,
    DATABASE_URL,
    LOG_LEVEL,
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER,
    JWT_SECRET,
    BCRYPT_PEPPER,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    ADMIN_EMAILS,
    COMPANY_LOGO_URL,
    COOKIE_SAME_SITE,
    COOKIE_SECURE,
} = process.env;
