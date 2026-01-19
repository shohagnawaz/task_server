import express from "express";
import { vehicleController } from "./vehicle.controller";

const router = express.Router();

// routes => controller => service
router.post("/", vehicleController.createVehicle);

router.get("/", vehicleController.getVehicle);

router.get("/", vehicleController.getSingleVehicle);