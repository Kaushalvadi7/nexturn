import fs from "fs/promises";
import cloudinary from "../config/cloudinary";
import { CLOUDINARY_FOLDER } from "../config";

const buildUploadOptions = () => {
    if (!CLOUDINARY_FOLDER) {
        return { resource_type: "auto" as const };
    }
    return { folder: CLOUDINARY_FOLDER, resource_type: "auto" as const };
};

const uploadImage = async (filePath: string) => {
    try {
        const result = await cloudinary.uploader.upload(
            filePath,
            buildUploadOptions()
        );
        return { secureUrl: result.secure_url, publicId: result.public_id };
    } finally {
        await fs.unlink(filePath).catch(() => undefined);
    }
};

const uploadImages = async (filePaths: string[]) => {
    return Promise.all(filePaths.map(filePath => uploadImage(filePath)));
};

const deleteImage = async (publicId: string) => {
    return cloudinary.uploader.destroy(publicId);
};

export default { uploadImage, uploadImages, deleteImage };
