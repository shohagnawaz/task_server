import { Request, Response } from "express";
import { pool } from "../../config/db";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
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

        const result = await bookingService.createBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status);

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
};

const getBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.getBooking();
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
};

const updateBooking = async (req: Request, res: Response) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status } = req.body;

    try {
        const result = await bookingService.updateBooking(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status, req.params.id as string);

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
};

export const bookingController = {
    createBooking,
    getBooking,
    updateBooking
}