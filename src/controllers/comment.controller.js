import mongoose, { Types, isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  console.log("GET ALL COMMENTS : " + videoId);

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video");
  }

  const aggregate = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
  ]);

  Comment.aggregatePaginate(aggregate, { page, limit })
    .then((result) => {
      return res
        .status(200)
        .json(
          new ApiResponse(200, result, "All comments fetched successfully")
        );
    })
    .catch((err) => err?.message || "ERROR");
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

  console.log("UPDATE COMMENT : " + newComment);
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
  const { commentId } = req.params;
  if (!isValidObjectId(commentId))
    throw new ApiError(400, "Please enter a valid comment Id");

  const commentDelete = await Comment.findByIdAndDelete(commentId);
  if (!commentDelete)
    throw new ApiError(400, "Something went wrong while deleting the comment");

  return res.status(200).json(new ApiResponse(200, {}, "Deleted Successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
