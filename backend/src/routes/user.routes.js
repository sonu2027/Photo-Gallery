import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  finduser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadImage } from "../controllers/image.controller.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/").post(loginUser);

router.route("/image").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  uploadImage
);

router.route("/image").put(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateProfile
);

import { sendemail } from "../controllers/user.controller.js";
router.route("/sendemail").post(upload.fields([]), sendemail);

router.route("/finduser").post(upload.fields([]), finduser);

import { deleteAccount } from "../controllers/user.controller.js";
router.route("/deleteaccount").delete(upload.fields([]), deleteAccount);

export default router;
