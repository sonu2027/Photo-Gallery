import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const imageSchema = new Schema(
  {
    image: {
      type: String, //cloudinary url
      required: true,
    },
    image_public_id: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    ownerId: {
      type: String,
      required: true,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

imageSchema.plugin(mongooseAggregatePaginate);

export const Image = mongoose.model("Image", imageSchema);
