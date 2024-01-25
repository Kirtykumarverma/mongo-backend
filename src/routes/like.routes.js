import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/v/:commentId").post(toggleCommentLike);
router.route("/toggle/v/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);

export default router;
