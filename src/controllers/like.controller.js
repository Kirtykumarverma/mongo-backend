import mongoose, { mongo } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const user = req.user?._id;

  const video = await Video.findById({
    _id: new mongoose.Types.ObjectId(videoId),
  });

  if (!video) {
    throw new ApiError(404, "Video Id not Found");
  }

  console.log("CHECK VIDEO ID IN VIDEO's " + video);

  console.log("LIKE CONTROLLER VIDEO TEST :  " + videoId);
  console.log("LIKE CONTROLLER USER TEST :  " + user);

  if (!videoId) {
    throw new ApiError(404, "Video id not found");
  }

  const likedVideo = await Like.create({
    video: new mongoose.Types.ObjectId(videoId),
    comment: null,
    tweet: null,
    likedBy: user,
  });

  console.log(likedVideo);
  if (!likedVideo) {
    throw new ApiError(500, "Something went wrong while Liked the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideo, "Successfully Liked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const user = req.user?._id;

  console.log("LIKE CONTROLLER COMMENT TEST :  " + commentId);
  console.log("LIKE CONTROLLER USER TEST :  " + user);

  if (!commentId) {
    throw new ApiError(404, "Video id not found");
  }

  // const likedComment = await Like.create({
  //   comment: new mongoose.Types.ObjectId(commentId),
  //   likedBy: user,
  // });

  const likedComment = await Like.create({
    video: nnull,
    comment: mongoose.Types.ObjectId(commentId),
    tweet: null,
    likedBy: user,
  });

  console.log(likedComment);
  if (!likedComment) {
    throw new ApiError(500, "Something went wrong while Liked the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedComment, "Successfully comment liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const user = req.user?._id;

  console.log("LIKE CONTROLLER TWEET TEST :  " + tweetId);
  console.log("LIKE CONTROLLER USER TEST :  " + user);

  if (!tweetId) {
    throw new ApiError(404, "Video id not found");
  }

  const likedTweet = await Like.create({
    tweet: new mongoose.Types.ObjectId(tweetId),
    likedBy: user,
  });

  console.log(likedTweet);
  if (!likedTweet) {
    throw new ApiError(500, "Something went wrong while Liked the video");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, likedTweet, "Successfully tweet Liked"));
  //TODO: toggle like on tweet
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  console.log("YOU ARE AT GET LIKED VIDEOS");
  const aggregate = await Like.aggregate([
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "LikedVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "User",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              User: {
                $first: "$User",
              },
            },
          },
        ],
      },
    },
  ]);

  const likedVideos = aggregate.map((item) => item.LikedVideos);

  console.log("Like liked videos" + likedVideos);

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "All videos fetched successfully"));
});

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };
