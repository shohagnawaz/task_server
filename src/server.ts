import express, { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";
import { vehicleRoutes } from "./modules/vehicle/vehicle.routes";
import { bookingRouter } from "./modules/booking/booking.routers";

const app = express();
const port = config.port;

// middleware/parser
app.use(express.json());
// app.use(express.urlencoded());

// initializing DB
initDB();

app.get('/', logger, (req: Request, res: Response) => {
    res.send('Hello Next Level Developers!')
});

// Users CRUD
app.use("/api/v1/users", logger, userRoutes);

// Vehicles CRUD
app.use("/api/v1/vehicles", logger, vehicleRoutes);

// bookings CRUD
app.use("/api/v1/bookings", logger, bookingRouter);

// for wrong path (if anyone hit wrong path)
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        path: req.path
    })
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
