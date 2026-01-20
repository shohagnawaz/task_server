import { Request, Response } from "express";
import { vehicleService } from "./vehicle.service";

const createVehicle = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = req.body;
    try {
        const result = await vehicleService.createVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status);

        res.status(201).json({
            success: true,
            message: "Vehicle inserted successfully",
            data: result.rows[0]
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const getVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getVehicle();
        res.status(200).json({
            success: true,
            message: "vehicles fetched successfully",
            data: result.rows
        })

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const getSingleVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.getSingleVehicle(req.params.id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User fetched successfully",
                data: result.rows[0]
            })
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const updateVehicle = async (req: Request, res: Response) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status, id } = req.body;

    try {
        const result = await vehicleService.updateVehicle(vehicle_name, type, registration_number, daily_rent_price, availability_status, req.params.id as string);

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
};

const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleService.deleteVehicle(req.params.id as string);

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
};

export const vehicleController = {
    createVehicle,
    getVehicle,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
}