import cloudinary from "../lib/cloudinary.js";

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const isImage =
      req.file.mimetype.startsWith("image/");

    const resourceType =
      isImage ? "image" : "raw";

    const uploadResult = await new Promise(
      (resolve, reject) => {
        const uploadStream =
          cloudinary.uploader.upload_stream(
            {
              folder: "tution-app",
              resource_type: resourceType,
              use_filename: true,
              unique_filename: true,
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

        uploadStream.end(req.file.buffer);
      }
    );

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
    console.error(
      "File upload error:",
      error
    );

    return res.status(500).json({
      message: "Failed to upload file",
    });
  }
};