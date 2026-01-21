import express, { Request, Response } from "express";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRouter } from "./modules/booking/booking.routers";
import { authRoutes } from "./modules/auth/auth.routes";

const app = express();
// middleware/parser
app.use(express.json());

// initializing DB
initDB();

app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello Next Level Developers!')
});

// Users CRUD: localhost:5000
app.use("/api/v1/users", logger, userRoutes);

// Vehicles CRUD: localhost:5000
app.use("/api/v1/vehicles", logger, vehicleRoutes);

// bookings CRUD: localhost:5000
app.use("/api/v1/bookings", logger, bookingRouter);

// auth routes
app.use("/api/v1/auth", authRoutes);

// for wrong path (if anyone hit wrong path)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
});

export default app;