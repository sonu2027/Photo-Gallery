import { Router } from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { deleteImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  uploadImage
);

router.route("/viewimage").delete(upload.fields([]), deleteImage);

export default router;
