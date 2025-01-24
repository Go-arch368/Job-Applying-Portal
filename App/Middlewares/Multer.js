import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            const uploadDir = './uploads';
            await fs.mkdir(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (err) {
            cb(err, null);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname); // Extract file extension
        const baseName = path.basename(file.originalname, ext); // Extract filename without extension
        cb(null, `${baseName}-${uniqueSuffix}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 500 * 1024 * 1024 }, // 100 MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

export default upload;
