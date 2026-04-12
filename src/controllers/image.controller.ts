import { NextFunction, Request, Response } from "express";
import imageService from "../services/image.service";

const uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files: Express.Multer.File[] = [];
        if (req.file) {
            files.push(req.file);
        }

        if (req.files) {
            if (Array.isArray(req.files)) {
                files.push(...req.files);
            } else {
                const fileMap = req.files as Record<
                    string,
                    Express.Multer.File[]
                >;
                if (fileMap.image) {
                    files.push(...fileMap.image);
                }
                if (fileMap.images) {
                    files.push(...fileMap.images);
                }
            }
        }

        if (files.length === 0) {
            return res.status(400).json({ message: "Image file is required." });
        }

        const uploaded =
            files.length === 1
                ? [await imageService.uploadImage(files[0].path)]
                : await imageService.uploadImages(files.map(file => file.path));

        if (uploaded.length === 1) {
            return res.status(201).json({
                secureUrl: uploaded[0].secureUrl,
                publicId: uploaded[0].publicId,
                items: uploaded,
            });
        }

        return res.status(201).json({ items: uploaded });
    } catch (error) {
        return next(error);
    }
};

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { publicId } = req.body;
        if (!publicId) {
            return res.status(400).json({ message: "publicId is required." });
        }

        const result = await imageService.deleteImage(publicId);
        return res.status(200).json({ result });
    } catch (error) {
        return next(error);
    }
};

export default { uploadImage, deleteImage };
