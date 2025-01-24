import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./src/routes/authRoutes";
import doctorRoutes from "./src/routes/doctorRoutes";
import bookingRoutes from "./src/routes/bookingRoutes";
import reviewRoutes from "./src/routes/reviewRoutes";

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

export default app;
