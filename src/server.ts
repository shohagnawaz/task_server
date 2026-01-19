import express, { Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";
import logger from "./middleware/logger";
import { userRoutes } from "./modules/user/user.routes";

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
app.use("/api/v1/vehicles", logger, )




// Vehicles CRUD
app.put("/api/v1/vehicles/:id", logger, async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;

    try {
        const result = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [
            vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.id
        ]);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicles not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle updated successfully"
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});
// Vehicles CRUD
app.delete("/api/v1/vehicles/:id", logger, async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`DELETE FROM vehicles WHERE id=$1`, [
            req.params.id
        ]);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "Vehicle not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Vehicle deleted successfully",
                data: null
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
});

// bookings CRUD
app.post("/api/v1/bookings", logger, async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

    try {
        const customer = await pool.query(
            "SELECT id FROM users WHERE id = $1",
            [customer_id]
        );

        if (customer.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Customer does not exist"
            });
        }

        const vehicle = await pool.query(
            "SELECT id FROM vehicles WHERE id = $1",
            [vehicle_id]
        );

        if (vehicle.rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Vehicle does not exist"
            });
        }

        const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status]);

        res.status(201).json({
            success: true,
            message: "Bookings inserted successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
// bookings CRUD => get all bookings
app.get("/api/v1/bookings", logger, async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`SELECT * FROM bookings`);
        res.status(200).json({
            success: true,
            message: "bookings fetched successfully",
            data: result.rows
        });

    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});
// bookings CRUD
app.put("/api/v1/bookings/:id", logger, async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

    try {
        const result = await pool.query(`UPDATE bookings SET customer_id=$1, vehicle_id=$2, rent_start_date=$3, rent_end_date=$4, total_price=$5, status=$6 WHERE id=$7 RETURNING *`, [
            customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, req.params.id  
        ]);

        if(result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "Bookings not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "Bookings updated successfully"
            })
        }

    } catch(err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

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
