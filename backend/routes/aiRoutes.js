import express from "express";
import multer from "multer";
import { generateSummary } from "../controllers/aiController.js";

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(), // keeps file in memory instead of saving to disk
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

router.post("/", upload.single("file"),generateSummary);

export default router;
