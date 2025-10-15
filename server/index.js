import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes.js';
import audioUploadRoute from './routes/AudioRoutes.js';
import contactsRoutes from './routes/ContactsRoutes.js';
import setUpSocket from './Socket.js';
import messageRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

app.use(cookieParser());

// const allowedOrigins = [
//   "https://chat-x-mauve.vercel.app",
//   "https://chat-x-git-main-niranjan-c-bs-projects.vercel.app"
// ];

const allowedOrigins = [
  "https://chat-x-mauve.vercel.app",
  "https://chat-x-git-main-niranjan-c-bs-projects.vercel.app",
  "http://localhost:5173", // for local testing
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, Postman, or Render health checks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn(`⚠️  CORS blocked for origin: ${origin}`);
      return callback(null, false); // don't throw an error
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);



app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use("/api/contacts", contactsRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/channel", channelRoutes);
app.use("/upload", audioUploadRoute);

const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Socket.IO
setUpSocket(server);

// Database
mongoose.connect(databaseURL).then(() => {
    console.log('Connected to MongoDB');
});
