import { ADMIN_EMAILS, SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_SECURE, SMTP_USER } from "../config";
import companyStatRepository from "../repository/company-stat.repository";
import logger from "../utils/logger";
import emailTemplateService from "./email-template.service";

type InquiryNotificationInput = {
    id: number;
    full_name: string;
    email: string;
    phone?: string | null;
    company_name?: string | null;
    category_name?: string | null;
    subject?: string | null;
    message: string;
    created_at?: Date | string | null;
};

type DownloadLeadNotificationInput = {
    name: string;
    email: string;
    asset: "catalogue" | "company_profile";
};

type DownloadLeadNotificationMeta = {
    ip?: string;
    userAgent?: string;
    referer?: string;
};

const parseBoolean = (value?: string) => {
    if (!value) return undefined;
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
    if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
    return undefined;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const clean = (value?: string) => String(value || "").trim();

const parseEmailList = (raw: string) => {
    if (!raw) return [] as string[];

    const unique = new Set<string>();
    raw.split(/[;,]/)
        .map((v) => v.trim())
        .filter(Boolean)
        .forEach((email) => {
            if (isValidEmail(email)) {
                unique.add(email);
            }
        });

    return Array.from(unique);
};

const parseAdminEmails = () => {
    const raw = clean(ADMIN_EMAILS);
    const parsed = parseEmailList(raw);
    if (raw && parsed.length === 0) {
        logger.warn("ADMIN_EMAILS is set but contains no valid email addresses.");
    }
    return parsed;
};

const parseCompanyStatsInquiryReceiverEmails = async () => {
    const emailRow = await companyStatRepository.findByKey(companyStatRepository.CONTACT_INQUIRY_RECEIVER_EMAIL_KEY);
    const raw = clean(String(emailRow?.value || ""));
    const parsed = parseEmailList(raw);
    if (raw && parsed.length === 0) {
        logger.warn("company_stats inquiry receiver email is set but invalid.", {
            key: companyStatRepository.CONTACT_INQUIRY_RECEIVER_EMAIL_KEY,
        });
    }
    return parsed;
};

const parseCompanyStatsContactEmails = async () => {
    const emailRow = await companyStatRepository.findByKey(companyStatRepository.CONTACT_EMAIL_KEY);
    const raw = clean(String(emailRow?.value || ""));
    const parsed = parseEmailList(raw);
    if (raw && parsed.length === 0) {
        logger.warn("company_stats email is set but invalid.", {
            key: companyStatRepository.CONTACT_EMAIL_KEY,
        });
    }
    return parsed;
};

const resolveNotificationRecipients = async () => {
    const adminEmails = parseAdminEmails();
    if (adminEmails.length > 0) {
        return adminEmails;
    }

    const inquiryReceiverEmails = await parseCompanyStatsInquiryReceiverEmails();
    if (inquiryReceiverEmails.length > 0) {
        return inquiryReceiverEmails;
    }

    const companyStatEmails = await parseCompanyStatsContactEmails();
    if (companyStatEmails.length > 0) {
        return companyStatEmails;
    }

    logger.info("Email notifications disabled (ADMIN_EMAILS, inquiry receiver email, and company_stats email are empty).");
    return [];
};

let cachedTransporter: { sendMail: (options: any) => Promise<any> } | null | undefined;

const getTransporter = async () => {
    if (cachedTransporter !== undefined) return cachedTransporter;

    let nodemailerModule: any;
    try {
        // Nodemailer is an optional dependency in this repo; install it in production:
        // `npm i nodemailer`
        nodemailerModule = await import("nodemailer");
    } catch (error) {
        cachedTransporter = null;
        logger.warn("Email notifications disabled (nodemailer not installed).", { error });
        return cachedTransporter;
    }

    const smtpHost = clean(SMTP_HOST);
    const smtpPort = clean(SMTP_PORT);
    const smtpSecure = clean(SMTP_SECURE);
    const smtpUser = clean(SMTP_USER);
    const smtpPass = clean(SMTP_PASS);

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass) {
        cachedTransporter = null;
        logger.info("Email notifications disabled (missing SMTP_* env vars).");
        return cachedTransporter;
    }

    const port = Number(smtpPort);
    if (!port || Number.isNaN(port)) {
        cachedTransporter = null;
        logger.warn("Email notifications disabled (SMTP_PORT is invalid).");
        return cachedTransporter;
    }
    const secure = parseBoolean(smtpSecure) ?? port === 465;

    const nodemailer = nodemailerModule.default || nodemailerModule;
    cachedTransporter = nodemailer.createTransport({
        host: smtpHost,
        port,
        secure,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    return cachedTransporter;
};

const sendInquiryCreatedNotification = async (inquiry: InquiryNotificationInput, filesCount = 0) => {
    const transporter = await getTransporter();
    if (!transporter) return;

    const to = await resolveNotificationRecipients();
    if (to.length === 0) {
        return;
    }

    const from = clean(SMTP_FROM) || clean(SMTP_USER);
    if (!from) {
        logger.warn("Email notifications disabled (SMTP_FROM/SMTP_USER missing).");
        return;
    }

    const subject = `New inquiry submitted (ID: ${inquiry.id})`;
    const lines = [
        // `Environment: ${NODE_ENV || "development"}`,
        `Inquiry ID: ${inquiry.id}`,
        `Name: ${inquiry.full_name}`,
        `Email: ${inquiry.email}`,
        inquiry.phone ? `Phone: ${inquiry.phone}` : null,
        inquiry.company_name ? `Company: ${inquiry.company_name}` : null,
        inquiry.category_name ? `Category: ${inquiry.category_name}` : null,
        inquiry.subject ? `Subject: ${inquiry.subject}` : null,
        `Files uploaded: ${filesCount}`,
        "",
        "Message:",
        inquiry.message,
    ].filter(Boolean);

    const html = await emailTemplateService.renderInquiryCreatedEmail({
        inquiryId: inquiry.id,
        // environment: NODE_ENV || "development",
        name: inquiry.full_name,
        email: inquiry.email,
        phone: inquiry.phone || "",
        company: inquiry.company_name || "",
        category: inquiry.category_name || "",
        subject: inquiry.subject || "",
        filesUploaded: filesCount,
        createdAt: inquiry.created_at ? String(inquiry.created_at) : "",
        message: inquiry.message,
    });

    await transporter.sendMail({
        from,
        to,
        subject,
        text: lines.join("\n"),
        html,
    });
};

const sendDownloadLeadNotification = async (lead: DownloadLeadNotificationInput, meta: DownloadLeadNotificationMeta = {}) => {
    const transporter = await getTransporter();
    if (!transporter) return;

    const to = await resolveNotificationRecipients();
    if (to.length === 0) {
        return;
    }

    const from = clean(SMTP_FROM) || clean(SMTP_USER);
    if (!from) {
        logger.warn("Email notifications disabled (SMTP_FROM/SMTP_USER missing).");
        return;
    }

    const assetLabel = lead.asset === "company_profile" ? "Company Profile" : "Catalogue";
    const isCompanyProfile = lead.asset === "company_profile";
    const subject = isCompanyProfile ? `Company profile viewed/downloaded (${lead.email})` : `Download: ${assetLabel} (${lead.email})`;

    const lines = isCompanyProfile
        ? ["Someone just viewed or downloaded the company's profile.", `Name: ${lead.name}`, `Email: ${lead.email}`].filter(Boolean)
        : [
              //   `Environment: ${NODE_ENV || "development"}`,
              `Asset: ${assetLabel}`,
              `Name: ${lead.name}`,
              `Email: ${lead.email}`,
              meta.ip ? `IP: ${meta.ip}` : null,
              meta.userAgent ? `User-Agent: ${meta.userAgent}` : null,
              meta.referer ? `Referer: ${meta.referer}` : null,
          ].filter(Boolean);

    const html = await emailTemplateService.renderDownloadLeadEmail({
        assetLabel,
        actionText: isCompanyProfile
            ? "Someone just viewed or downloaded the company's profile."
            : "A visitor shared details before downloading a file.",
        name: lead.name,
        email: lead.email,
        // environment: NODE_ENV || "development",
        ip: meta.ip,
        userAgent: meta.userAgent,
        referer: meta.referer,
        includeMeta: !isCompanyProfile,
    });

    await transporter.sendMail({
        from,
        to,
        subject,
        text: lines.join("\n"),
        html,
    });
};

export default { sendInquiryCreatedNotification, sendDownloadLeadNotification };
