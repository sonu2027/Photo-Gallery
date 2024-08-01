import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import fs from "fs";
import { Image } from "../models/image.model.js";

const registerUser = async (req, res, next) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;

  console.log("req.body........", req.body);
  console.log("req.files........", req.files);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  let imageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.image) &&
    req.files.image.length > 0
  ) {
    imageLocalPath = req.files.image[0].path;
  }
  console.log("imagelocalpath: ", imageLocalPath);

  if (existedUser) {
    fs.unlinkSync(imageLocalPath);
    throw new ApiError(409, "User with email or username already exists");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  console.log("Image: ", image);

  const user = await User.create({
    fullName,
    email,
    password,
    username,
    image: image?.url || "",
    image_public_id: image?.public_id || "",
  });

  // If you want that password don't go to response in frontend
  // const createdUser = await User.findById(user._id).select("-password");

  const createdUser = await User.findById(user._id);

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
};

const loginUser = async (req, res) => {
  console.log("req.body in login: ", req.body);
  const { userEmail: email, userPassword: password } = req.body;
  try {
    const foundUser = await User.find({ email, password });

    console.log("foundUser found is : ", foundUser);

    if (foundUser.length == 0) {
      return res.status(500).json(new ApiResponse(200, {}, "User not found"));
      // throw new ApiError(500, "User not found");
    }

    res.status(200).json({ data:foundUser, message: "User logged in Successfully" });
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Return an empty array or handle the error as needed
  }
};

const updateProfile = async (req, res, next) => {
  let { fullName, userId, email, password, username } = req.body;
  console.log("req.body: ", req.body);
  console.log("req.files", req.files);
  if (fullName) {
    try {
      console.log("Full name and userId", fullName, userId);

      // Update anme of user
      const updationResult = await User.updateOne(
        { _id: userId }, // Filter
        { $set: { fullName: fullName } }
      );
      console.log("updation result: ", updationResult);

      return res
        .status(201)
        .json(new ApiResponse(200, fullName, "name updated successfully"));
    } catch (error) {
      console.error("Error updating name:", error);
      return res.status(500).json({ error: "Failed to update name" });
    }
  } else if (username) {
    try {
      console.log("username and userId", username, userId);

      // Update anme of user
      const updationResult = await User.updateOne(
        { _id: userId }, // Filter
        { $set: { username: username } }
      );
      console.log("updation result: ", updationResult);

      return res
        .status(201)
        .json(new ApiResponse(200, username, "username updated successfully"));
    } catch (error) {
      console.error("Error updating username:", error);
      return res.status(500).json({ error: "Failed to update username" });
    }
  } else if (email && userId) {
    try {
      console.log("email and userId", email, userId);

      // Update anme of user
      const updationResult = await User.updateOne(
        { _id: userId }, // Filter
        { $set: { email: email } }
      );
      console.log("updation result: ", updationResult);

      return res
        .status(201)
        .json(new ApiResponse(200, email, "email updated successfully"));
    } catch (error) {
      console.error("Error updating email:", error);
      return res.status(500).json({ error: "Failed to update email" });
    }
  } else if (password) {
    try {
      console.log("username and userId", password, userId);

      if (password[0] != password[1]) {
        console.log("password doesn't match");
        throw error;
      }

      // Update anme of user
      if (userId) {
        const updationResult = await User.updateOne(
          { _id: userId }, // Filter
          { $set: { password: password[0] } }
        );
        console.log("updation result: ", updationResult);
      } else {
        const updationResult = await User.updateOne(
          { email: email }, // Filter
          { $set: { password: password[0] } }
        );
        console.log("updation result: ", updationResult);
      }

      return res
        .status(201)
        .json(new ApiResponse(200, password, "password updated successfully"));
    } catch (error) {
      console.error("Error updating password:", error);
      return res.status(500).json({ error: "Failed to update password" });
    }
  } else {
    try {
      let { userId } = req.body;

      console.log("userId", userId);

      console.log("req.files: ", req.files);

      let imageLocalPath;
      if (
        req.files &&
        Array.isArray(req.files.image) &&
        req.files.image.length > 0
      ) {
        imageLocalPath = req.files.image[0].path;
      }
      console.log("imagelocalpath: ", imageLocalPath);

      const image = await uploadOnCloudinary(imageLocalPath);

      console.log("Image: ", image);

      // delete previoud profile picture from cloudinary
      let get_user = await User.find();
      get_user = get_user.filter((e) => e._id == userId);
      let user_pub_id = get_user[0].image_public_id;

      deleteFromCloudinary(user_pub_id);

      // Update Image of user
      const updationResult = await User.updateOne(
        { _id: userId }, // Filter
        { $set: { image: image.url, image_public_id: image.public_id } }
      );
      console.log("updation result: ", updationResult);

      return res
        .status(201)
        .json(new ApiResponse(200, image.url, "pp updated successfully"));
    } catch (error) {
      console.error("Error updating pp:", error);
      // return
    }
  }
};

const sendemail = async (req, res) => {
  const { email, verificationCode, otp } = req.body;

  console.log("req.body: ", req.body);

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "sonu.mondal.2027@gmail.com",
      pass: "olpu rpqo rdcr gjdd",
    },
  });

  console.log("transporter: ", transporter);

  // Setup email data
  let mailOptions = {
    from: "sonu.mondal.2027@gmail.com",
    to: email,
    subject: "Email Verification Code",
    text: `Your verification code is: ${verificationCode}`,
  };

  console.log("mailOptions: ", mailOptions);

  try {
    // Send mail with defined transport object
    await transporter.sendMail(mailOptions);
    res.send("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
};

const finduser = async (req, res) => {
  const { email } = req.body;
  console.log("req.body: ", req.body);

  try {
    const response = await User.findOne({ email });

    console.log("response of user found", response);
    if (response) {
      return res.status(201).json(new ApiResponse(200, response, "user found"));
    } else {
      throw error;
    }
  } catch (error) {
    console.log("user not found: error: ", error);
    return res.status(500).json({ error: "User not found" });
  }
};

const deleteAccount = async (req, res) => {
  console.log("req.body", req.body);
  const { userId, email } = req.body;
  try {
    const image = await Image.find({ ownerId: userId });
    console.log("Images: ", image);
    image.map(async (e) => {
      deleteFromCloudinary(e.image_public_id);
      await Image.deleteOne({ image_public_id: e.image_public_id });
    });
    const user = await User.findOne({ email });
    console.log("user:", user);
    deleteFromCloudinary(user.image_public_id);
    const response = await User.deleteOne({ email });
    console.log("response", response);
    if (response) {
      return res
        .status(201)
        .json(new ApiResponse(200, response, "user deleted successfully"));
    } else {
      throw error;
    }
  } catch (error) {
    console.log("user not found: error: ", error);
    return res.status(500).json({ error: "User doesn't delete" });
  }
};

export {
  registerUser,
  loginUser,
  updateProfile,
  sendemail,
  finduser,
  deleteAccount,
};
