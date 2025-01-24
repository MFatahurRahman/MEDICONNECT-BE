import express, { Request, Response } from "express";
import {
  getDoctors,
  addDoctor,
} from "../controllers/doctorController";

const router = express.Router();

/**
 * @route GET /api/doctors
 * @desc Get all doctors
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const doctors = await getDoctors();
    res.status(200).json(doctors);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch doctors" });
  }
});

/**
 * @route POST /api/doctors
 * @desc Add a new doctor
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    const doctor = await addDoctor(req.body);
    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to add doctor" });
  }
});

export default router;
