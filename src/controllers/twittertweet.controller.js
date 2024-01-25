import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  console.log("TWITTER TWEET :" + content);
  if (!content) {
    throw new ApiError(400, "content required");
  }
  const tweeted = await Tweet.create(content, req.user?._id);

  if (!tweeted) {
    throw new ApiError(500, "Someting went wrong while addig the tweet");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, tweeted, "SUCCESSFULLY TWEETED"));
});

export { createTweet };
