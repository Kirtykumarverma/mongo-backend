import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const publishVideo = asyncHandler(async (req, res) => {
  //[]check wether title and description is not empty

  try {
    const { title, description } = req.body;
    console.log(title);

    if ([title, description].some((files) => files?.trim() === "")) {
      throw new ApiError(400, "title and decriptionn is required");
    }

    let videoLocalPath; //req.files?.video[0]?.path;
    let tumbnailLocalPath; //= req.files?.thumbnail[0]?.path;
    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.video.length > 0
    ) {
      videoLocalPath = req.files?.video[0].path;
    }

    if (
      req.files &&
      Array.isArray(req.files.thumbnail) &&
      req.files.thumbnail.length > 0
    ) {
      tumbnailLocalPath = req.files?.thumbnail[0].path;
    }

    if (!(videoLocalPath || tumbnailLocalPath)) {
      throw new ApiError(400, "Local video and thumbnail file is required");
    }

    const videoPath = await uploadOnCloudinary(videoLocalPath);
    const thumbnailPath = await uploadOnCloudinary(tumbnailLocalPath);

    if (!(videoPath || thumbnailPath)) {
      throw new ApiError(400, "video and thumbnail is required");
    }

    const videoPublish = await Video.create({
      videoFile: videoPath.secure_url,
      thumbnail: thumbnailPath.secure_url,
      title,
      description,
      duration: videoPath.duration,
      owner: req.user._id,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, videoPublish, "Video Published Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while publishing a Video"
    );
  }
});

const getVideoById = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;
    if (!videoId) {
      throw new ApiError(400, "VideoId is required");
    }

    const video = await Video.findById(videoId);
    console.log(video);

    return res
      .status(200)
      .json(new ApiResponse(200, video.videoFile, "Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while while getting a video"
    );
  }
});

export { publishVideo, getVideoById };
