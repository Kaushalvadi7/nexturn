import { Request, Response, NextFunction } from "express";
import HttpException from "../exceptions/HttpException";
import companyStatRepository from "../repository/company-stat.repository";
import imageService from "../services/image.service";

type ContactInfoValue = {
    email?: string;
    inquiryReceiverEmail?: string;
    phone?: string;
    whatsapp?: string;
    location?: string;
    companyDescription?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    x?: string;
    youtube?: string;
    companyProfile?: string;
};

const parseLegacyContactInfoValue = (value: string): Required<ContactInfoValue> => {
    const empty = {
        email: "",
        inquiryReceiverEmail: "",
        phone: "",
        whatsapp: "",
        location: "",
        companyDescription: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        x: "",
        youtube: "",
        companyProfile: "",
    };
    if (!value) return empty;
    try {
        const parsed = JSON.parse(value);
        return {
            email: String(parsed?.email || ""),
            inquiryReceiverEmail: String(parsed?.inquiryReceiverEmail || parsed?.inquiry_receiver_email || ""),
            phone: String(parsed?.phone || ""),
            whatsapp: String(parsed?.whatsapp || ""),
            location: String(parsed?.location || ""),
            companyDescription: String(parsed?.companyDescription || parsed?.company_description || ""),
            facebook: String(parsed?.facebook || ""),
            instagram: String(parsed?.instagram || ""),
            linkedin: String(parsed?.linkedin || ""),
            x: String(parsed?.x || ""),
            youtube: String(parsed?.youtube || ""),
            companyProfile: String(parsed?.companyProfile || parsed?.company_profile || ""),
        };
    } catch {
        return empty;
    }
};

const getHeroSliderImages = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const images = await companyStatRepository.findHeroSliderImages();
        return res.status(200).json(
            images.map((image) => ({
                id: image.id,
                image_url: image.image_url,
                public_url: image.public_id || "",
                sort_order: image.sort_order ?? 0,
            })),
        );
    } catch (error) {
        return next(error);
    }
};

const addHeroSliderImages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = (req.files as Express.Multer.File[]) || [];
        if (files.length === 0) {
            throw new HttpException(400, "At least one image is required.");
        }

        const existingCount = await companyStatRepository.countHeroSliderImages();
        if (existingCount + files.length > 7) {
            throw new HttpException(400, "You can have at most 7 hero slider images.");
        }

        const filePaths = files.map((f) => f.path);
        const uploads = await imageService.uploadImages(filePaths);
        await companyStatRepository.createHeroSliderImages(
            uploads.map((uploaded, index) => ({
                image_url: uploaded.secureUrl,
                public_id: uploaded.publicId,
                sort_order: existingCount + index,
            })),
        );

        const images = await companyStatRepository.findHeroSliderImages();
        return res.status(201).json(
            images.map((image) => ({
                id: image.id,
                image_url: image.image_url,
                public_url: image.public_id || "",
                sort_order: image.sort_order ?? 0,
            })),
        );
    } catch (error) {
        return next(error);
    }
};

const deleteHeroSliderImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id)) {
            throw new HttpException(400, "Invalid hero slider image id.");
        }

        const image = await companyStatRepository.findHeroSliderImageById(id);
        if (!image) {
            throw new HttpException(404, "Hero slider image not found.");
        }

        if (image.public_id) {
            await imageService.deleteImage(image.public_id).catch(() => undefined);
        }

        await companyStatRepository.deleteHeroSliderImageById(id);
        await companyStatRepository.resequenceHeroSliderSortOrder();

        return res.status(200).json({ message: "Hero slider image deleted successfully" });
    } catch (error) {
        return next(error);
    }
};

const getContactInfo = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const [
            emailRow,
            inquiryReceiverEmailRow,
            phoneRow,
            whatsappRow,
            locationRow,
            companyDescriptionRow,
            facebookRow,
            instagramRow,
            linkedinRow,
            xRow,
            youtubeRow,
            companyProfileRow,
        ] = await Promise.all([
            companyStatRepository.findByKey(companyStatRepository.CONTACT_EMAIL_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_INQUIRY_RECEIVER_EMAIL_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_PHONE_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_WHATSAPP_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_LOCATION_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_COMPANY_DESCRIPTION_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_FACEBOOK_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_INSTAGRAM_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_LINKEDIN_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_X_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_YOUTUBE_KEY),
            companyStatRepository.findByKey(companyStatRepository.CONTACT_COMPANY_PROFILE_KEY),
        ]);

        const value = {
            email: String(emailRow?.value || ""),
            inquiryReceiverEmail: String(inquiryReceiverEmailRow?.value || ""),
            phone: String(phoneRow?.value || ""),
            whatsapp: String(whatsappRow?.value || ""),
            location: String(locationRow?.value || ""),
            companyDescription: String(companyDescriptionRow?.value || ""),
            facebook: String(facebookRow?.value || ""),
            instagram: String(instagramRow?.value || ""),
            linkedin: String(linkedinRow?.value || ""),
            x: String(xRow?.value || ""),
            youtube: String(youtubeRow?.value || ""),
            companyProfile: String(companyProfileRow?.value || ""),
        };

        const hasAny = Boolean(
            value.email ||
            value.inquiryReceiverEmail ||
            value.phone ||
            value.whatsapp ||
            value.location ||
            value.companyDescription ||
            value.facebook ||
            value.instagram ||
            value.linkedin ||
            value.x ||
            value.youtube ||
            value.companyProfile,
        );
        if (hasAny) {
            return res.status(200).json(value);
        }

        const legacy = await companyStatRepository.findByKey(companyStatRepository.CONTACT_INFO_KEY);
        if (legacy?.value) {
            return res.status(200).json(parseLegacyContactInfoValue(legacy.value));
        }

        return res.status(200).json({
            email: "",
            inquiryReceiverEmail: "",
            phone: "",
            whatsapp: "",
            location: "",
            companyDescription: "",
            facebook: "",
            instagram: "",
            linkedin: "",
            x: "",
            youtube: "",
            companyProfile: "",
        });
    } catch (error) {
        return next(error);
    }
};

const replaceContactInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {
            email,
            inquiryReceiverEmail,
            phone,
            whatsapp,
            location,
            companyDescription,
            facebook,
            instagram,
            linkedin,
            x,
            youtube,
            companyProfile,
        } = (req.body || {}) as ContactInfoValue;

        const nextValue = {
            email: String(email || "").trim(),
            inquiryReceiverEmail: String(inquiryReceiverEmail || "").trim(),
            phone: String(phone || "").trim(),
            whatsapp: String(whatsapp || "").trim(),
            location: String(location || "").trim(),
            companyDescription: String(companyDescription || "").trim(),
            facebook: String(facebook || "").trim(),
            instagram: String(instagram || "").trim(),
            linkedin: String(linkedin || "").trim(),
            x: String(x || "").trim(),
            youtube: String(youtube || "").trim(),
            companyProfile: String(companyProfile || "").trim(),
        };

        await Promise.all([
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_EMAIL_KEY, nextValue.email, "Email"),
            companyStatRepository.upsertByKey(
                companyStatRepository.CONTACT_INQUIRY_RECEIVER_EMAIL_KEY,
                nextValue.inquiryReceiverEmail,
                "Inquiry Receiver Email",
            ),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_PHONE_KEY, nextValue.phone, "Phone"),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_WHATSAPP_KEY, nextValue.whatsapp, "WhatsApp"),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_LOCATION_KEY, nextValue.location, "Location"),
            companyStatRepository.upsertByKey(
                companyStatRepository.CONTACT_COMPANY_DESCRIPTION_KEY,
                nextValue.companyDescription,
                "Company Description",
            ),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_FACEBOOK_KEY, nextValue.facebook, "Facebook URL"),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_INSTAGRAM_KEY, nextValue.instagram, "Instagram URL"),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_LINKEDIN_KEY, nextValue.linkedin, "LinkedIn URL"),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_X_KEY, nextValue.x, "X URL"),
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_YOUTUBE_KEY, nextValue.youtube, "YouTube URL"),
            companyStatRepository.upsertByKey(
                companyStatRepository.CONTACT_COMPANY_PROFILE_KEY,
                nextValue.companyProfile,
                "Company Profile URL",
            ),
        ]);

        await companyStatRepository.deleteByKey(companyStatRepository.CONTACT_INFO_KEY).catch(() => undefined);
        return res.status(200).json(nextValue);
    } catch (error) {
        return next(error);
    }
};

const uploadCompanyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new HttpException(400, "Company profile PDF file is required.");
        }

        const originalName = String(req.file.originalname || "").toLowerCase();
        const mimeType = String(req.file.mimetype || "").toLowerCase();
        const isPdf = mimeType === "application/pdf" || originalName.endsWith(".pdf");
        if (!isPdf) {
            throw new HttpException(400, "Only PDF files are allowed for company profile.");
        }

        const uploaded = await imageService.uploadImage(req.file.path);

        const previousPublicIdRow = await companyStatRepository.findByKey(companyStatRepository.CONTACT_COMPANY_PROFILE_PUBLIC_ID_KEY);
        const previousPublicId = String(previousPublicIdRow?.value || "").trim();
        if (previousPublicId && previousPublicId !== uploaded.publicId) {
            await imageService.deleteImage(previousPublicId).catch(() => undefined);
        }

        await Promise.all([
            companyStatRepository.upsertByKey(companyStatRepository.CONTACT_COMPANY_PROFILE_KEY, uploaded.secureUrl, "Company Profile URL"),
            companyStatRepository.upsertByKey(
                companyStatRepository.CONTACT_COMPANY_PROFILE_PUBLIC_ID_KEY,
                uploaded.publicId,
                "Company Profile Public ID",
            ),
        ]);

        return res.status(201).json({
            message: "Company profile uploaded successfully.",
            companyProfile: uploaded.secureUrl,
        });
    } catch (error) {
        return next(error);
    }
};

export default {
    getHeroSliderImages,
    addHeroSliderImages,
    deleteHeroSliderImage,
    getContactInfo,
    replaceContactInfo,
    uploadCompanyProfile,
};
