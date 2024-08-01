import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (fileBuffer, filename) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { resource_type: "auto", public_id: filename }, 
        (error, result) => {
          if (error) {
            console.error("Error uploading file:", error);
            reject(error);
          } else {
            console.log("File uploaded successfully:", result);
            resolve(result);
          }
        }
      )
      .end(fileBuffer);
  });
};

const deleteFromCloudinary = async (public_id) => {
  return new Promise((resolve, reject) => {
    // Delete the image from Cloudinary
    console.log("delete for cloudinary called");
    cloudinary.uploader.destroy(public_id, (error, result) => {
      if (error) {
        console.error("Error deleting image:", error);
        reject(error);
      } else {
        console.log("Image deleted successfully:", result);
        resolve(result);
      }
    });
  });
};

export { uploadOnCloudinary, deleteFromCloudinary };
