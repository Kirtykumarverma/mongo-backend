import mongoose, { Schema } from "mongoose";

const playListSchema = new Schema({}, { timestamps: true });

export const PlayList = mongoose.model("PlayList", playListSchema);
