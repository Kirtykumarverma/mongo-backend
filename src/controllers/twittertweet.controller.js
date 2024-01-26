import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  try {
    //TODO: create tweet
    const { content } = req.body;

    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
      content,
      owner: req.user?._id,
    });
    console.log("TWEET LOGGED IN" + tweet);

    return res
      .status(200)
      .json(new ApiResponse(200, tweet, "Tweet created successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while tweeting"
    );
  }
});

const getUserTweets = asyncHandler(async (req, res) => {
  try {
    // TODO: get user tweets
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid UserId");
    }
    console.log("USER iD :: " + userId);
    const userTweet = await Tweet.find({
      owner: new mongoose.Types.ObjectId(userId),
    });
    console.log(userTweet);

    return res
      .status(200)
      .json(
        new ApiResponse(200, userTweet, "All user tweet fetched successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while fetching the user tweets"
    );
  }
});

const updateTweet = asyncHandler(async (req, res) => {
  try {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { newTweet } = req.body;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetId");
    }
    if (!newTweet) {
      throw new ApiError(400, "New tweet required");
    }

    const tweetExists = await Tweet.findById(tweetId);
    if (!tweetExists) {
      throw new ApiError("400", "Tweet does not exists");
    }
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        content: newTweet,
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "Tweet updated successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while updating the tweet"
    );
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  try {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
      throw new ApiError(400, "Invalid tweetIs");
    }
    const tweetExists = await Tweet.findById(tweetId);
    if (!tweetExists) {
      throw new ApiError("400", "Tweet does not exists");
    }
    await Tweet.findByIdAndDelete({ tweetId }, { new: true });
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Deleted Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while deleting the  tweet"
    );
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
