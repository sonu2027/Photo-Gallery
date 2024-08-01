import { ApiError } from "../utils/ApiError.js";
import { Image } from "../models/image.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

const uploadImage = async (req, res, next) => {
  const { ownerId } = req.body;

  console.log("req.body........", req.body);
  console.log("gghgh", ownerId);
  console.log("req.files........", req.files);

  let imagePublicId;
  let imageBuffer;
  if (
    req.files &&
    Array.isArray(req.files.image) &&
    req.files.image.length > 0
  ) {
    imagePublicId = `${Date.now()}_${req.files.image[0].originalname}`;
    imageBuffer = req.files.image[0].buffer;
  }
  console.log("imagePublicId and imageBuffer: ", imagePublicId);

  const response = await uploadOnCloudinary(imageBuffer, imagePublicId);

  console.log("Image: ", response);

  const image = await Image.create({
    image: response?.url || "",
    image_public_id: response?.public_id || "",
    ownerId,
  });

  const createdImage = await Image.findById(image._id);

  if (!createdImage) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  const images = await Image.find();

  return res
    .status(201)
    .json(new ApiResponse(200, images, "Image uploaded successfully"));
};

const deleteImage = async (req, res) => {
  try {
    let imageUrl = req.query.param1;
    imageUrl = imageUrl.slice(8, imageUrl.length);
    imageUrl = "http://" + imageUrl;

    console.log("Image url for delete: ", imageUrl, typeof imageUrl);

    let all_image = await Image.find();
    console.log("all iamge: ", all_image);
    let req_img = all_image.filter((e) => e.image == imageUrl);
    console.log("image_public_id: ", req_img);
    req_img = req_img[0].image_public_id;
    console.log("req pub_id: ", req_img);

    // Delete image document from MongoDB
    const deletionResult = await Image.deleteOne({ image: imageUrl });
    console.log("deletion result: ", deletionResult);
    console.log(
      `${deletionResult.deletedCount} document(s) deleted from MongoDB`
    );

    // delete from cloudinary
    console.log("typeof req_img", typeof req_img);
    deleteFromCloudinary(req_img);

    return res
      .status(201)
      .json(new ApiResponse(200, imageUrl, "Image deleted successfully"));
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
};

export { uploadImage, deleteImage };
