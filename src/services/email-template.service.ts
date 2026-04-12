import fs from "fs/promises";
import path from "path";
import { COMPANY_LOGO_URL } from "../config";

const templateCache = new Map<string, string>();

const escapeHtml = (value: unknown) =>
    String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const loadTemplate = async (name: string) => {
    if (templateCache.has(name)) return templateCache.get(name)!;

    const candidates = [
        path.resolve(process.cwd(), "src", "templates", "email", name),
        path.resolve(process.cwd(), "dist", "templates", "email", name),
        path.resolve(__dirname, "..", "templates", "email", name),
    ];

    let raw = "";
    for (const filePath of candidates) {
        try {
            raw = await fs.readFile(filePath, "utf-8");
            break;
        } catch {
            // Try next path.
        }
    }

    if (!raw) {
        throw new Error(`Email template not found: ${name}`);
    }

    templateCache.set(name, raw);
    return raw;
};

const renderTokens = (template: string, tokens: Record<string, string>) => {
    let output = template;
    for (const [key, value] of Object.entries(tokens)) {
        output = output.replaceAll(`{{${key}}}`, value);
    }
    return output;
};

const detailRow = (label: string, value: unknown) => {
    const safeValue = escapeHtml(value);
    return `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:170px;color:#475569;font-size:12px;font-weight:700;vertical-align:top;text-transform:uppercase;letter-spacing:0.4px;">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#0f172a;font-size:14px;line-height:20px;">${safeValue}</td></tr>`;
};

const renderBase = async ({
    title,
    header,
    subheader,
    summaryBadge,
    content,
}: {
    title: string;
    header: string;
    subheader: string;
    summaryBadge: string;
    content: string;
}) => {
    const logoUrl = String(COMPANY_LOGO_URL || "").trim();
    const base = await loadTemplate("base.html");
    return renderTokens(base, {
        TITLE: escapeHtml(title),
        HEADER: escapeHtml(header),
        SUBHEADER: escapeHtml(subheader),
        COMPANY_LOGO_URL: escapeHtml(logoUrl),
        SUMMARY_BADGE: summaryBadge,
        CONTENT: content,
    });
};

const renderInquiryCreatedEmail = async (data: {
    inquiryId: number;
    // environment: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    category?: string | null;
    subject?: string | null;
    filesUploaded: number;
    createdAt?: string;
    message: string;
}) => {
    const inquiryTemplate = await loadTemplate("inquiry-created.html");
    const rows = [
        // detailRow("Environment", data.environment),
        detailRow("Name", data.name),
        detailRow("Email", data.email),
        data.phone ? detailRow("Phone", data.phone) : "",
        data.company ? detailRow("Company", data.company) : "",
        data.category ? detailRow("Category", data.category) : "",
        data.subject ? detailRow("Subject", data.subject) : "",
        detailRow("Files Uploaded", data.filesUploaded),
        data.createdAt ? detailRow("Created At", data.createdAt) : "",
    ]
        .filter(Boolean)
        .join("");

    const content = renderTokens(inquiryTemplate, {
        INQUIRY_ID: escapeHtml(data.inquiryId),
        DETAIL_ROWS: rows,
        MESSAGE: escapeHtml(data.message),
    });

    return renderBase({
        title: `New inquiry submitted (ID: ${data.inquiryId})`,
        header: "New Inquiry Received",
        subheader: "A customer just submitted a new inquiry form.",
        summaryBadge: "",
        content,
    });
};

const renderDownloadLeadEmail = async (data: {
    assetLabel: string;
    actionText: string;
    name: string;
    email: string;
    // environment?: string;
    ip?: string;
    userAgent?: string;
    referer?: string;
    includeMeta?: boolean;
}) => {
    const leadTemplate = await loadTemplate("download-lead.html");
    const includeMeta = Boolean(data.includeMeta);
    const rows = [
        detailRow("Name", data.name),
        detailRow("Email", data.email),
        // includeMeta && data.environment ? detailRow("Environment", data.environment) : "",
        includeMeta && data.ip ? detailRow("IP", data.ip) : "",
        includeMeta && data.userAgent ? detailRow("User Agent", data.userAgent) : "",
        includeMeta && data.referer ? detailRow("Referer", data.referer) : "",
    ]
        .filter(Boolean)
        .join("");

    const content = renderTokens(leadTemplate, {
        ASSET: escapeHtml(data.assetLabel),
        ACTION_TEXT: escapeHtml(data.actionText),
        DETAIL_ROWS: rows,
    });

    return renderBase({
        title: `Download: ${data.assetLabel} (${data.email})`,
        header: "New Download Lead Captured",
        subheader: "A visitor shared details before downloading a file.",
        summaryBadge: "",
        content,
    });
};

export default {
    renderInquiryCreatedEmail,
    renderDownloadLeadEmail,
};
