import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

// app.use("/api/v1/users", logger, userRoutes)
// routes => controller => service
router.post("/", userControllers.createUser);

router.get("/", userControllers.getUser);

router.put("/:id", userControllers.putUser);

router.delete("/:id", userControllers.deleteUser);

export const userRoutes = router;