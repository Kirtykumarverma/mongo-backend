import { Router } from "express";
import {
  createTweet,
  // deleteTweet,
  // getUserTweets,
  // updateTweet,
} from "../controllers/twittertweet.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/create").post(createTweet);
// router.route("/user/:userId").get(getUserTweets);
// router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;
