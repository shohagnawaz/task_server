import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await userServices.createUser(name, email, password, phone, role);

        res.status(201).json({
            success: true,
            message: "User inserted successfully",
            data: result.rows[0]
        });

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const getUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUser();

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: result.rows
        })
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

const putUser = async (req: Request, res: Response) => {
    const { name, email, password, phone, role } = req.body;

    try {
        const result = await userServices.putUser(name, email, password, phone, role, req.params.id as string);

        if (result.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            })
        } else {
            res.status(200).json({
                success: true,
                message: "User update successfully",
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

const deleteUser = async (req: Request, res: Response) => {
    try {
        const result = await userServices.deleteUser(req.params.id as string);

        if (result.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "User deleted successfully",
                data: null
            });
        }

    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
};

export const userControllers = {
    createUser,
    getUser,
    putUser,
    deleteUser
}