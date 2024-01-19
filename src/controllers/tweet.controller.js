import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    const { tweet, test } = req.body;
    console.log("TWEET " + tweet, test);
    if (!tweet) {
      throw new ApiResponse(200, "Content is required");
    }

    const createdTweet = await Tweet.create(tweet, req.user._id);
    console.log(createdTweet);
    if (!tweet) {
      throw new ApiResponse(400, "Something went wrong while creating tweet");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, createdTweet, "Tweet successfully tweeted"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while creating tweet"
    );
  }
});
const getUserTweets = asyncHandler(async (req, res) => {});
const updateTweet = asyncHandler(async (req, res) => {});
const deleteTweet = asyncHandler(async (req, res) => {});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
