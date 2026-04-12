import CompanyStat from "../models/CompanyStat";
import Image from "../models/Image";

const HERO_SLIDER_KEY = "hero_slider_images";
const HERO_SLIDER_ENTITY_TYPE = "hero_slider";
const HERO_SLIDER_ENTITY_ID = 1;
const CONTACT_INFO_KEY = "contact_info";
const CONTACT_EMAIL_KEY = "email";
const CONTACT_INQUIRY_RECEIVER_EMAIL_KEY = "inquiry_receiver_email";
const CONTACT_PHONE_KEY = "phone_no";
const CONTACT_WHATSAPP_KEY = "whatsapp_no";
const CONTACT_LOCATION_KEY = "location";
const CONTACT_COMPANY_DESCRIPTION_KEY = "company_description";
const CONTACT_FACEBOOK_KEY = "facebook_url";
const CONTACT_INSTAGRAM_KEY = "instagram_url";
const CONTACT_LINKEDIN_KEY = "linkedin_url";
const CONTACT_X_KEY = "x_url";
const CONTACT_YOUTUBE_KEY = "youtube_url";
const CONTACT_COMPANY_PROFILE_KEY = "company_profile_url";
const CONTACT_COMPANY_PROFILE_PUBLIC_ID_KEY = "company_profile_public_id";

const findByKey = async (key: string) => {
    return CompanyStat.findOne({ where: { key } });
};

const findByKeys = async (keys: string[]) => {
    const rows = await Promise.all(keys.map((key) => findByKey(key)));
    return rows.filter(Boolean) as CompanyStat[];
};

const upsertByKey = async (key: string, value: string, label?: string | null) => {
    const payload = {
        value,
        label: label ?? null,
        updated_at: new Date(),
    };

    const existing = await findByKey(key);
    if (existing) {
        await existing.update({ ...payload, key });
        return existing;
    }
    return CompanyStat.create({ ...payload, key } as any);
};

const deleteByKey = async (key: string) => {
    return CompanyStat.destroy({ where: { key } });
};

const findHeroSliderImages = async () => {
    return Image.findAll({
        where: {
            entity_type: HERO_SLIDER_ENTITY_TYPE,
            entity_id: HERO_SLIDER_ENTITY_ID,
        },
        order: [
            ["sort_order", "ASC"],
            ["id", "ASC"],
        ],
    });
};

const countHeroSliderImages = async () => {
    return Image.count({
        where: {
            entity_type: HERO_SLIDER_ENTITY_TYPE,
            entity_id: HERO_SLIDER_ENTITY_ID,
        },
    });
};

const createHeroSliderImages = async (
    data: Array<{ image_url: string; public_id: string; sort_order: number }>,
) => {
    if (data.length === 0) return [];
    return Image.bulkCreate(
        data.map(item => ({
            entity_type: HERO_SLIDER_ENTITY_TYPE,
            entity_id: HERO_SLIDER_ENTITY_ID,
            image_url: item.image_url,
            public_id: item.public_id,
            is_primary: false,
            sort_order: item.sort_order,
        })),
    );
};

const findHeroSliderImageById = async (id: number) => {
    return Image.findOne({
        where: {
            id,
            entity_type: HERO_SLIDER_ENTITY_TYPE,
            entity_id: HERO_SLIDER_ENTITY_ID,
        },
    });
};

const deleteHeroSliderImageById = async (id: number) => {
    return Image.destroy({
        where: {
            id,
            entity_type: HERO_SLIDER_ENTITY_TYPE,
            entity_id: HERO_SLIDER_ENTITY_ID,
        },
    });
};

const resequenceHeroSliderSortOrder = async () => {
    const images = await findHeroSliderImages();
    await Promise.all(
        images.map((image, index) => image.update({ sort_order: index })),
    );
    return images.length;
};

export default {
    HERO_SLIDER_KEY,
    HERO_SLIDER_ENTITY_TYPE,
    HERO_SLIDER_ENTITY_ID,
    CONTACT_INFO_KEY,
    CONTACT_EMAIL_KEY,
    CONTACT_INQUIRY_RECEIVER_EMAIL_KEY,
    CONTACT_PHONE_KEY,
    CONTACT_WHATSAPP_KEY,
    CONTACT_LOCATION_KEY,
    CONTACT_COMPANY_DESCRIPTION_KEY,
    CONTACT_FACEBOOK_KEY,
    CONTACT_INSTAGRAM_KEY,
    CONTACT_LINKEDIN_KEY,
    CONTACT_X_KEY,
    CONTACT_YOUTUBE_KEY,
    CONTACT_COMPANY_PROFILE_KEY,
    CONTACT_COMPANY_PROFILE_PUBLIC_ID_KEY,
    findByKey,
    findByKeys,
    upsertByKey,
    deleteByKey,
    findHeroSliderImages,
    countHeroSliderImages,
    createHeroSliderImages,
    findHeroSliderImageById,
    deleteHeroSliderImageById,
    resequenceHeroSliderSortOrder,
};
