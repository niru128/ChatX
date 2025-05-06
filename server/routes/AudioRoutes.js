import express from "express";
import multer from "multer";
import { uploadAudio } from "../controllers/AudioController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/audio", upload.single("audio"), uploadAudio);

export default router;
