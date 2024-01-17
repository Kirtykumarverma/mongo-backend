import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { getVideoById, publishVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/publishVideo").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishVideo
);

router.route("/c/:videoId").get(verifyJWT, getVideoById);
export default router;
