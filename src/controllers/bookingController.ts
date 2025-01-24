import mongoose from "mongoose";
import { Request, Response } from "express";
import Booking from "../models/Booking";
import Doctor from "../models/Doctor";

export const createBooking = async (data: {
  user: string;
  entity: "doctor";
  entityId: string;
  service: {
    name: string;
    description: string;
  };
  date: string;
  time: string;
}) => {
  try {
    const { user, entity, entityId, service, date, time } = data;

    if (!user || !entity || !entityId || !service || !date || !time) {
      throw new Error("All fields (user, entity, entityId, service, date, time) are required");
    }

    const userId = mongoose.Types.ObjectId.isValid(user) ? new mongoose.Types.ObjectId(user) : null;

    if (!userId) {
      throw new Error("Invalid user ID");
    }

    if (entity !== "doctor") {
      throw new Error("Invalid entity type. Only 'doctor' is supported.");
    }

    const doctor = await Doctor.findById(entityId);
    if (!doctor) {
      throw new Error("Doctor not found");
    }

    const booking = new Booking({
      user: userId,
      entity,
      entityId: new mongoose.Types.ObjectId(entityId),
      service,
      date,
      time,
    });

    return await booking.save();
  } catch (error) {
    console.error("Error creating booking:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create booking");
  }
};

export const getBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid or missing user ID." });
      return;
    }

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "entityId",
        select: "name location specialist", // Fields yang akan diambil dari entitas terkait
      })
      .populate({
        path: "user",
        select: "name email", // Fields user yang akan diambil
      });

    if (!bookings || bookings.length === 0) {
      res.status(404).json({ message: "No bookings found for this user." });
      return;
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    console.log("Updating Booking ID:", bookingId, "to status:", status);

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking ID");
    }

    const validStatuses = ["Progress", "Confirmed", "Done", "Cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Invalid status value");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true }
    );

    if (!updatedBooking) {
      throw new Error("Booking not found");
    }

    console.log("Booking status updated successfully:", updatedBooking);
    return { message: "Booking status updated successfully", updatedBooking };
  } catch (error) {
    console.error("Error updating booking status:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update booking status"
    );
  }
};

export const deleteBooking = async (bookingId: string) => {
  try {
    console.log("Received Booking ID:", bookingId);

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Invalid booking ID");
    }

    const booking = await Booking.findByIdAndDelete(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    console.log("Booking deleted successfully:", booking);
    return { message: "Booking deleted successfully", booking };
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to delete booking");
  }
};

