import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

// app.use("/api/v1/users", logger, userRoutes)
// routes => controller => service
router.post("/", userControllers.createUser);

router.get("/", auth("admin"), userControllers.getUser);

router.put("/:id", auth("admin", "user"), userControllers.putUser);

router.delete("/:id", auth("admin", "user"), userControllers.deleteUser);

export const userRoutes = router;