import express from "express";
import { addReview, getReviews } from "../controllers/reviewController";

const router = express.Router();

/**
 * @route POST /api/reviews/:targetId
 * @desc Add a review for a target (doctor)
 */
router.post("/:targetId", async (req, res) => {
  await addReview(req, res);
});

/**
 * @route GET /api/reviews/:targetId
 * @desc Get reviews for a specific target (doctor)
 */
router.get("/:targetId", async (req, res) => {
  await getReviews(req, res);
});

export default router;
