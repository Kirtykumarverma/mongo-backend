import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localHostFilePath) => {
  try {
    if (!localHostFilePath) return null;
    //Upload file on cloudinary
    const response = await cloudinary.uploader.upload(localHostFilePath, {
      resource_type: "auto",
    });
    // file has been uploaded successfully
    console.log("file is uploaded on cloudinary", response.url);
  } catch (error) {
    fs.unlink(localHostFilePath); //remove the locally saved temporary file as the upload opertaion is failed
    return null;
  }
};

export { uploadOnCloudinary };