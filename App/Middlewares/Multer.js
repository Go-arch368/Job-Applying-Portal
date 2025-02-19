import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../Config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    console.log("Uploaded File Type:", file.mimetype);
    console.log("File Name:", file.originalname);

    let folder = "job-applications";
    let resource_type = "auto";

    if (file.mimetype.startsWith("image/")) {
      folder = "job-applications/images";
    } else if (file.mimetype.startsWith("video/")) {
      folder = "job-applications/videos";
      resource_type = "video";
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
      file.mimetype === "text/plain" || // .txt
      file.originalname.endsWith(".pdf") || // Handle misidentified PDFs
      file.originalname.endsWith(".docx")  // Handle misidentified DOCX
    ) {
      folder = "job-applications/resumes";
      resource_type = "raw";
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype} - ${file.originalname}`);
    }

    return {
      folder,
      resource_type,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  }
});

const upload = multer({ storage });

export default upload;
