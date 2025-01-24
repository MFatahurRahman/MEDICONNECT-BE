import express, { Request, Response } from "express";
import { register, login } from "../controllers/authController";
import { addReview, addFavorite, getFavorites } from "../controllers/authController";
import User from "../models/User";

const router = express.Router();

router.post("/register", async (req: Request, res: Response) => {
  await register(req, res);
});

router.post("/login", async (req: Request, res: Response) => {
  await login(req, res);
});

router.put("/edit/:id", async (req, res) => {
  const { id } = req.params;
  const { phone, name, email } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { phone, name, email },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully.", user: updatedUser });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while updating the user.",
      error: error instanceof Error ? error.message : error,
    });
  }
});

router.post("/reviews", async (req: Request, res: Response) => {
  await addReview(req, res);
});

router.post("/favorites", async (req: Request, res: Response) => {
  await addFavorite(req, res);
});

router.get("/favorites/:userId", async (req: Request, res: Response) => {
  await getFavorites(req, res);
});

export default router;
