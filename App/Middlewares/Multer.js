import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../Config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "job-applications";
    let resource_type = "auto"; // Auto-detect

    if (file.mimetype.startsWith("image/")) {
      folder = "job-applications/images";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "job-applications/videos";
      resource_type = "video";
    } else if (file.mimetype === "application/pdf") {
      folder = "job-applications/resumes";
      resource_type = "raw";
    } else {
      throw new Error("Unsupported file type");
    }

    return {
      folder,
      resource_type,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });

export default upload;
