import express, { Request, Response } from "express";
import {
  createBooking,
  updateBookingStatus,
  deleteBooking,
  getBookings
} from "../controllers/bookingController";

const router = express.Router();

// Create a new booking
router.post("/", async (req: Request, res: Response) => {
  console.log("Request payload:", req.body); // Logging payload
  try {
    const booking = await createBooking(req.body);
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error: any) {
    console.error("Error creating booking:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.get("/:userId", getBookings);

router.patch("/:bookingId/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const updatedBooking = await updateBookingStatus(req.params.bookingId, status);
    res.status(200).json(updatedBooking);
  } catch (error: any) {
    console.error("Error updating booking status:", error.message);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:bookingId", async (req: Request, res: Response) => {
  try {
    console.log("Deleting booking with ID:", req.params.bookingId);

    const deletedBooking = await deleteBooking(req.params.bookingId);
    res.status(200).json({ message: "Booking deleted successfully", deletedBooking });
  } catch (error: any) {
    console.error("Error deleting booking:", error.message);
    res.status(400).json({ error: error.message });
  }
});

export default router;