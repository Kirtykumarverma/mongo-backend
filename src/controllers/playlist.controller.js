import mongoose, { isValidObjectId } from "mongoose";
import { PlayList } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  console.log("PLAYLIST TESTS: " + name + " " + description);
  //TODO: create playlist
  if (!(name, description)) {
    throw new ApiError(400, "Name and description is requrired");
  }

  const playListNameExists = await PlayList.findOne({ name: name });

  if (playListNameExists) {
    throw new ApiError(400, "Please select a different playist");
  }

  const createdPlayList = await PlayList.create({
    name,
    description,
    // videos:[],
    owner: req.user?._id,
  });

  console.log("Playlist created : " + createPlaylist);
  if (!createdPlayList) {
    throw new ApiError(500, "Something went wrong while creating the playlist");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createPlaylist, "Playlist created successfully")
    );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    //TODO: get user playlists

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user");
    }

    //const userPayList = await PlayList.find({ owner: userId });
    const userPayList = await PlayList.aggregate([
      {
        $match: {
          owner: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "playListOwner",
          pipeline: [
            {
              $project: {
                fullName: 1,
                username: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
    ]);

    console.log(userPayList);

    return res
      .status(200)
      .json(
        new ApiResponse(200, userPayList, "User Playlist fetched successfully")
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while fetching the playlist");
  }
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    //TODO: add video to playlist
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playListId");
    }
    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }

    const playList = await PlayList.findById(playlistId);
    const videoExistsInPlayList = playList.video.includes(videoId);

    if (videoExistsInPlayList) {
      throw new ApiError(400, "Video already exists in this playlist");
    }
    const addvideo = await PlayList.findByIdAndUpdate(
      playlistId,
      {
        $push: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, { addvideo }, "Video added successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while adding videos to playlist"
    );
  }
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

    console.log("TEST :: " + playlistId, videoId);
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playListId");
    }

    if (!isValidObjectId(videoId)) {
      throw new ApiError(400, "Invalid videoId");
    }

    const removeVideoIdFromPlayist = await PlayList.findByIdAndUpdate(
      playlistId,
      {
        $pull: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      { new: true }
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          removeVideoIdFromPlayist,
          "Video removed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message ||
        "Something went wrong while deleteing a video from plalist"
    );
  }
});

const deletePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    // TODO: delete playlist

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlistId");
    }

    await PlayList.findByIdAndDelete(
      { _id: new mongoose.Types.ObjectId(playlistId) },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, {}, "Playlist Deleted Successfully"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "somethign went wrong dleting the paylist"
    );
  }
});

const getPlaylistById = asyncHandler(async (req, res) => {
  try {
    //TODO: rethink about this

    const { playlistId } = req.params;
    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlistId");
    }
    const playlist = await PlayList.findById(playlistId);
    console.log("PLAYLIST :: " + playlist);
    if (!playlist) {
      throw new ApiError(400, "Playlist not found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, { playlist }, "Playlist fetched successfully")
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "somwthinh went wrong while fetching the playlist"
    );
  }
});

const updatePlaylist = asyncHandler(async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { name, description } = req.body;

    if (!isValidObjectId(playlistId)) {
      throw new ApiError(400, "Invalid playlistId");
    }

    if (!(name, description)) {
      throw new ApiError(400, "Both fields are required");
    }

    const updatedPlaylist = await PlayList.findByIdAndUpdate(
      playlistId,
      {
        $set: {
          name,
          description,
        },
      },
      { new: true }
    );

    console.log("UPDATED PLAYLIST :: " + updatedPlaylist);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { updatedPlaylist },
          "PLaylist updated successfully"
        )
      );
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "somethign went wrong while updating the playlist"
    );
  }
});
export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};
