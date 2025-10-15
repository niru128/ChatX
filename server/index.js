import express from 'express';
import mongoose, { mongo } from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/AuthRoutes.js';
import audioUploadRoute from './routes/AudioRoutes.js'
import contactsRoutes from './routes/ContactsRoutes.js';
import setUpSocket from './Socket.js';
import messageRoutes from './routes/MessagesRoutes.js';
import channelRoutes from './routes/ChannelRoutes.js';

dotenv.config(); //The function dotenv.config() is used in Node.js applications to load environment variables from a .env file into process.env. 

const app = express();
const port = process.env.PORT || 3000;
const databaseURL = process.env.DATABASE_URL;

app.use(cors({
    origin: 'https://chat-x-git-main-niranjan-c-bs-projects.vercel.app',
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}))

app.use("/uploads/profiles",express.static("uploads/profiles"))
app.use("/uploads/files",express.static("uploads/files"))


app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/contacts",contactsRoutes);
app.use("/api/messages",messageRoutes)
app.use("/api/channel",channelRoutes);
app.use("/upload", audioUploadRoute);
const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

setUpSocket(server);

mongoose.connect(databaseURL).then(() => {
    console.log('Connected to the database');
})

