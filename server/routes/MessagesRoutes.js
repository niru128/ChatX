import { Router } from "express";
import {verifyToken} from "../middlewares/AuthMiddleWare.js";
import { getMessages, uploadFiles } from "../controllers/MessageContainer.js";
import multer from "multer";

const messageRoutes  = Router();

const upload = multer({dest : "uploads/files"});

messageRoutes.post("/get-messages",verifyToken , getMessages);
messageRoutes.post("/upload-files",verifyToken,upload.single("file"),uploadFiles);

export default messageRoutes;   