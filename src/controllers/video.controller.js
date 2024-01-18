import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//TODO: COME BACK HERE WITH FULL CLARITY

const publishVideo = asyncHandler(async (req, res) => {
  //[]check wether title and description is not empty

  try {
    const { title, description } = req.body;
    console.log(title);

    if ([title, description].some((files) => files?.trim() === "")) {
      throw new ApiError(400, "title and decriptionn is required");
    }

    // const videoLocalPath = req.files?.videoFile[0]?.path;
    // console.log("VIDEO LOCAL PATH " + videoLocalPath);
    // const tumbnailLocalPath = req.files?.thumbnailFile[0]?.path;

    let videoLocalPath;
    let tumbnailLocalPath;
    if (
      req.files &&
      Array.isArray(req.files.videoFile) &&
      req.files.videoFile.length > 0
    ) {
      videoLocalPath = req.files?.videoFile[0].path;
    }

    if (
      req.files &&
      Array.isArray(req.files.thumbnailFile) &&
      req.files.thumbnailFile.length > 0
    ) {
      tumbnailLocalPath = req.files?.thumbnailFile[0].path;
    }

    if (!(videoLocalPath || tumbnailLocalPath)) {
      throw new ApiError(400, "Local video and thumbnail file is required");
    }

    const videoPath = await uploadOnCloudinary(videoLocalPath);
    const thumbnailPath = await uploadOnCloudinary(tumbnailLocalPath);

    console.log("CLOUDINARY RESPONSE FOR : " + videoPath);
    console.log("CLOUDINARY RESPONSE FOR : " + thumbnailPath);

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

    const videoExists = await Video.findOne({ _id: videoId });

    if (!videoExists) {
      throw new ApiError(400, "Video Not Found");
    }

    const video = await Video.findById(videoId);
    console.log(video);

    return res
      .status(200)
      .json(new ApiResponse(200, { video }, "Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while while getting a video"
    );
  }
});

const updateVideoDetails = asyncHandler(async (req, res) => {
  try {
    //TODO: update video details like title, description, thumbnail
    const { title, description } = req.body;
    console.log(req.body);
    const { videoId } = req.params;
    console.log(videoId);

    console.log(title + " " + description);
    const videoExists = await Video.findOne({ _id: videoId });

    if (!videoExists) {
      throw new ApiError(400, "Video Not Found");
    }

    if ([title, description].some((files) => files?.trim === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const updatedVideos = await Video.findByIdAndUpdate(
      videoId,
      {
        $set: {
          title,
          description,
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedVideos, "Video updated Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while updating a video details"
    );
  }
});

const deleteVideo = asyncHandler(async (req, res) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      throw new ApiError(400, "Video id is required");
    }
    const videoDelete = await Video.findByIdAndDelete(videoId, { new: true });
    console.log(videoDelete);
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Video Deleted Successfully"));
  } catch (error) {
    throw new ApiError(
      400,
      error?.message || "something went wrong while deleting a video"
    );
  }
});

export { publishVideo, getVideoById, updateVideoDetails, deleteVideo };
