import express from "express";
import {
  enrollCourse,
  getMyCourses,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/enroll/:courseId", authMiddleware, enrollCourse);
router.get("/me/courses", authMiddleware, getMyCourses);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;
