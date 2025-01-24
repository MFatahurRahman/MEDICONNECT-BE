// reviewsController.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import Doctor from "../models/Doctor";

export const addReview = async (req: Request, res: Response): Promise<Response> => {
  const { targetId, rating, comment, userId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid target ID." });
    }

    const review = {
      user: userId,
      rating,
      comment,
    };

    const target = await Doctor.findById(targetId);
    if (!target) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    target.reviews.push(review);
    await target.save();

    return res.status(200).json({ message: "Review added successfully.", target });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while adding the review." });
  }
};

/**
 * Get reviews for a doctor
 */
export const getReviews = async (req: Request, res: Response): Promise<Response> => {
  const { targetId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(targetId)) {
      return res.status(400).json({ message: "Invalid target ID." });
    }

    const target = await Doctor.findById(targetId).populate("reviews.user", "name email");
    if (!target) {
      return res.status(404).json({ message: "Doctor not found." });
    }

    const reviews = target.reviews;
    const averageRating = reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / reviews.length || 0;
    const totalReviews = reviews.length;

    return res.status(200).json({
      reviews,
      averageRating: averageRating.toFixed(2),
      totalReviews,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred while retrieving the reviews." });
  }
};