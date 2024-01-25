import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthCheck = asyncHandler(async (req, res) => {
  //TODO: check healthCheck and return ok

  try {
    return res.status(200).json(new ApiResponse(200, {}, "OK"));
  } catch (error) {
    throw new ApiError(
      500,
      error?.message || "Something went wrong while check health of our API"
    );
  }
});

export { healthCheck };
