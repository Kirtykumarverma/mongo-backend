import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const registerUser = asyncHandler(async (req, res) => {
  // [*] get user details for frontend
  // [*] validation - not empty
  // [*] check if user alreasy exists : {email,username}
  // [*] check for bgimage , check for avatar (complusary)
  // [*] upload them to cloudinary, avatar
  // [*] create user object - create antry in db
  // [*] remove password and refresh token from response
  // [*] check for user creation
  // [*]return res

  // const { fullName, email, username, password } = req.body;

  // if (
  //   [fullName, email, username, password].some((fields) => fields?.trim === "")
  // ) {
  //   throw new ApiError(400, "All fields are required");
  // }

  // const existedUser = await User.findOne({
  //   $or: [{ username }, { email }],
  // });

  // if (existedUser) {
  //   throw new ApiError(409, "User with email and username exists");
  // }

  // console.log(req.fields);
  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar local file is required");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // const coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // console.log(avatar);
  // console.log(coverImage);

  // if (!avatar) {
  //   throw new ApiError(400, "Avatar file is required");
  // }

  // const user = await User.create({
  //   fullName,
  //   avatar: avatar.url,
  //   coverImage: coverImage?.url || "",
  //   email,
  //   username: username.toLowerCase(),
  //   password,
  // });

  // const createdUser = await User.findById(user._id).select(
  //   "-password -refreshToken"
  // );

  // if (!createdUser) {
  //   throw new ApiError(500, "Someething went wrong while registering the user");
  // }

  // return res
  //   .status(201)
  //   .json(new ApiResponse(200, createdUser, "User regitered Successfully"));

  const { fullName, email, username, password } = req.body;
  //console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Local Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  console.log(avatar);

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

export { registerUser };
