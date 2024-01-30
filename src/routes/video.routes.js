import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import {
  deleteVideo,
  getVideoById,
  publishVideo,
  updateVideoDetails,
  getAllVideos,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.route("/").get(getAllVideos);

router.use(verifyJWT); //applied for all routes

router.route("/publishVideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnailFile",
      maxCount: 1,
    },
  ]),
  publishVideo
);

// router.route("/c/:videoId").get(getVideoById);

// router.route("/c/:videoId").patch(updateVideoDetails);

// router.route("/c/:videoId").delete(deleteVideo);

router
  .route("/:videoId")
  .get(getVideoById)
  .delete(deleteVideo)
  .patch(updateVideoDetails);

export default router;
