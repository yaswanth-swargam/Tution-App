import path from "path";
import cloudinary from "../lib/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const isImage = req.file.mimetype.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    // Get original filename and extension
    const extension = path.extname(req.file.originalname).toLowerCase();

    // Remove extension and sanitize filename
    const baseName = path
      .basename(req.file.originalname, extension)
      .replace(/[^\w-]/g, "_");

    // Make filename unique
    const uniqueName = `${baseName}_${Date.now()}`;

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "tution-app",
          resource_type: resourceType,

          // Important:
          // For raw files, keep the extension in the public ID.
          public_id: isImage
            ? uniqueName
            : `${uniqueName}${extension}`,

          unique_filename: false,

          timeout: 120000,
        },

        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      uploadStream.on("error", reject);

      uploadStream.end(req.file.buffer);
    });

    console.log("Cloudinary upload successful:", {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: resourceType,
    });

    return res.status(200).json({
      message: "File uploaded successfully",

      file: {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        file_name: req.file.originalname,
        file_type: req.file.mimetype,
        file_size: req.file.size,
        resource_type: resourceType,
      },
    });
  } catch (error) {
    console.error("File upload error:", {
      message: error.message,
      http_code: error.http_code,
      name: error.name,
    });

    return res.status(500).json({
      message: "Failed to upload file",
      error: error.message,
    });
  }
};