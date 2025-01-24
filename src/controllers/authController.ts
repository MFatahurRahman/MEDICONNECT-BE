import { Request, Response } from "express";
import User from "../models/User";
import Doctor from "../models/Doctor";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields (name, email, phone, password) are required" });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const existingUser = await User.findOne({ $or: [{ email }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or phone number already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "An unknown error occurred" });
  }
};

export const addReview = async (req: Request, res: Response) => {
  const { userId, doctorId, rating, comment } = req.body;

  if (!userId || !doctorId || !rating) {
    return res.status(400).json({ error: "All fields (userId, doctorId, rating) are required." });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const newReview = { target: doctorId, rating, comment, targetType: "doctor" };
    user.reviews.push(newReview);
    await user.save();

    doctor.reviews.push({ user: userId, rating, comment });
    await doctor.save();

    res.status(200).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
};

export const addFavorite = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, doctorId } = req.body;

    if (!userId || !doctorId) {
      return res.status(400).json({ error: "User ID and Doctor ID are required." });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const favoriteIndex = user.favorites.findIndex((fav) => fav._id.toString() === doctorId);

    if (favoriteIndex > -1) {
      user.favorites.splice(favoriteIndex, 1);
    } else {
      user.favorites.push({ _id: doctorId, type: "doctor" });
    }

    await user.save();
    return res.status(200).json({ message: "Favorites updated successfully", favorites: user.favorites });
  } catch (error) {
    return res.status(500).json({ error: "Failed to update favorites" });
  }
};

export const getFavorites = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const doctorFavorites = await Promise.all(
      user.favorites.map(async (favorite) => {
        if (favorite.type === "doctor") {
          return await Doctor.findById(favorite._id).select("name location specialist reviews");
        }
      })
    );

    return res.status(200).json({ doctorFavorites: doctorFavorites.filter((fav) => fav) });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch favorites" });
  }
};
