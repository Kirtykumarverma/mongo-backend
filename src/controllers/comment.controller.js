import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video
  try {
    const { comment } = req.body;
    const { videoId } = req.params;
    console.log(comment, videoId);
    if (!comment) throw new ApiError(400, "Comment required");
    if (!videoId) throw new ApiError(400, "video id is required");

    const publishComment = await Comment.create({
      content: comment,
      video: videoId,
      owner: req.user._id,
    });

    if (!publishComment) {
      throw new ApiError(
        500,
        "Something went wrong while submitting the comment"
      );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, publishComment, "comment published successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while submitting the comment"
    );
  }
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment
  const { newComment } = req.body;
  const { commentId } = req.params;

  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Please enter a valid comment Id");

  if (!newComment) throw new ApiError(400, "New comment not found");

  const updatedComment = await Comment.findByIdAndUpdate(commentId, {
    $set: {
      content: newComment,
    },
  });

  if (!updatedComment) {
    throw new ApiError(500, "Something went wrong while updating the comment");
  }

  return res.status(200).json(new ApiResponse(200, updatedComment, "Success"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
});

export { getVideoComments, addComment, updateComment, deleteComment };
