import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import app from "./src/app.js";
import { Image } from "./src/models/image.model.js";

dotenv.config({
  path: "/.env",
});

connectDB()
  .then(() => {
    app.get("/", (req, res) => {
      res.send(
        `<h1>Server is running at http://localhost:${process.env.PORT}</h1>`
      );
    });

    app.get("/image", async (req, res) => {
      const images = await Image.find();
      // const data={
      //     name:"sonu mondal"
      // }
      res.send(images);
    });

    // app.delete("/image/viewimage", async (req, res) => {
    //   try {
    //     const imageUrl = req.query.param1;

    //     console.log("Image url for delete: ", imageUrl);

    //     // Delete image document from MongoDB
    //     const deletionResult = await Image.deleteOne({ image: imageUrl });
    //     console.log("deletion result: ", deletionResult);
    //     console.log(
    //       `${deletionResult.deletedCount} document(s) deleted from MongoDB`
    //     );

    //     // Delete image from Cloudinary
    //     cloudinary.uploader.destroy(imageUrl, (error, result) => {
    //       if (error) {
    //         console.error(
    //           `Error deleting image ${imageUrl} from Cloudinary:`,
    //           error
    //         );
    //         return res
    //           .status(500)
    //           .json({ error: "Failed to delete image from Cloudinary" });
    //       } else {
    //         console.log(
    //           `Image ${imageUrl} deleted successfully from Cloudinary`
    //         );

    //         // Send response to client after both operations are completed
    //         return res
    //           .status(200)
    //           .json({ message: "Image deleted successfully" });
    //       }
    //     });
    //   } catch (error) {
    //     console.error("Error deleting image:", error);
    //     return res.status(500).json({ error: "Failed to delete image" });
    //   }
    // });


    app.listen(process.env.PORT || 8000, () => {
      console.log(
        `⚙️ Server is running at http://localhost:${process.env.PORT} : ${process.env.PORT || 8000}`
      );
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
