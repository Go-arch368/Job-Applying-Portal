import multer from "multer";
import cloudinary from "../../Config/cloudinary.js";

// Custom Multer storage engine — uses Cloudinary v2 upload_stream directly.
// This replaces multer-storage-cloudinary which only supports cloudinary v1.
class CloudinaryStorageEngine {
  _handleFile(req, file, cb) {
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
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.mimetype === "text/plain" ||
      file.originalname.endsWith(".pdf") ||
      file.originalname.endsWith(".docx")
    ) {
      folder = "job-applications/resumes";
      resource_type = "raw";
    } else {
      return cb(new Error(`Unsupported file type: ${file.mimetype} - ${file.originalname}`));
    }

    const public_id = `${file.fieldname}-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type, public_id },
      (error, result) => {
        if (error) return cb(error);
        cb(null, {
          fieldname:    file.fieldname,
          originalname: file.originalname,
          encoding:     file.encoding,
          mimetype:     file.mimetype,
          path:         result.secure_url,   // URL stored in DB
          size:         result.bytes,
          filename:     result.public_id,
          public_id:    result.public_id,
          secure_url:   result.secure_url,
        });
      }
    );

    file.stream.pipe(uploadStream);
  }

  _removeFile(req, file, cb) {
    if (file.public_id) {
      cloudinary.uploader.destroy(file.public_id, cb);
    } else {
      cb(null);
    }
  }
}

const storage = new CloudinaryStorageEngine();
const upload = multer({ storage });

export default upload;
