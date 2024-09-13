import { Router } from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { deleteImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { markedFav } from "../controllers/image.controller.js";
import { getImageDtls } from "../controllers/image.controller.js";

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
router.route("/markedfav").post(markedFav);
router.route("/getimagedtls").post(getImageDtls);

export default router;
