import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  try {
    //TODO:check subscriber or not
    const { channelId } = req.params;
    const userId = req.user?._id;
    if (!isValidObjectId(channelId)) {
      throw new ApiError(400, "Invalid channel Id");
    }

    const subscribed = await Subscription.findOne({
      subscriber: userId,
      channel: channelId,
    });

    if (!subscribed) {
      const subscribe = await Subscription.create({
        subscriber: userId,
        channel: channelId,
      });

      return res
        .status(200)
        .json(new ApiResponse(200, { subscribe }, "Subscribed"));
    } else {
      const unSubscribe = await Subscription.findOneAndDelete({
        subscriber: userId,
        channel: channelId,
      });

      return res.status(200).json(200, { unSubscribe }, "unsubscribed");
    }
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while subscribing and subscribe"
    );
  }
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  try {
    const { channelId } = req.params;

    console.log(channelId);
    if (!channelId) {
      throw new ApiError(400, "Invalis channelId");
    }

    // const subscribers = await Subscription.findById(
    //   {
    //     channel: new mongoose.Types.ObjectId(channelId),
    //   },
    //   { new: true }
    // );

    const subscribers = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(channelId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "channelsSubscriber",
        },
      },
      {
        $project: {
          channelsSubscriber: {
            username: 1,
            avatar: 1,
            createdAt: 1,
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, subscribers, "subscriber fetched "));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while fetching the subscribers"
    );
  }
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  try {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) {
      throw new ApiError(404, "Invalid Subscriber ID");
    }

    // const channels = await Subscription.findById(
    //   {
    //     channel: new mongoose.Types.ObjectId(subscriberId),
    //   },
    //   { new: true }
    // );

    const channels = await Subscription.aggregate([
      {
        $match: {
          channel: new mongoose.Types.ObjectId(subscriberId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "subscriber",
          foreignField: "_id",
          as: "subscribedChannels",
        },
      },
      {
        $project: {
          subscribedChannels: {
            username: 1,
            avatar: 1,
          },
        },
      },
    ]);

    return res
      .status(200)
      .json(new ApiResponse(200, channels, "channels fetched"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "something went wrong while fetching the channels"
    );
  }
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
