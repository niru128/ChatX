import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";

const setUpSocket = (server) => {
	const io = new SocketIoServer(server, {
		cors: {
			origin: process.env.ORIGIN,
			methods: ["GET", "POST"],
			credentials: true
		}
	});

	const userSocketMap = new Map();

	const disconnect = (socket) => {
		console.log(`client disconnected, ${socket.id}`);
		for (const [userId, socketId] of userSocketMap.entries()) {
			if (socketId === socket.id) {
				userSocketMap.delete(userId);
				break;
			}
		}
	};

	const sendMessage = async (message) => {
		console.log("🔥 sendMessage payload:", message);

		// Build DB payload
		const dbPayload = {
			sender: message.sender,
			recipient: message.recipient,
			content: message.text,
			messageType: message.messageType,
			fileUrl: message.fileUrl,
			timeStamps: new Date(),
		};

		const createdMessage = await Message.create(dbPayload);
		const messageData = await Message.findById(createdMessage._id)
			.populate("sender", "id email firstName lastName image color")
			.populate("recipient", "id email firstName lastName image color");

		// Emit to both users
		const senderSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);

		if (recipientSocketId) io.to(recipientSocketId).emit("receiveMessage", messageData);
		if (senderSocketId) io.to(senderSocketId).emit("receiveMessage", messageData);
	};

	const sendChannelMessage = async (message) => {
		console.log("🔥 sendChannelMessage payload:", message);

		const dbPayload = {
			sender: message.sender,
			recipient: null,
			content: message.text,
			messageType: message.messageType,
			fileUrl: message.fileUrl,
			timeStamps: new Date(),
			channelId: message.channelId,
		};

		const createdMessage = await Message.create(dbPayload);
		const messageData = await Message.findById(createdMessage._id)
			.populate("sender", "id email firstName lastName image color")
			.exec();

		await Channel.findByIdAndUpdate(message.channelId, {
			$push: { messages: createdMessage._id },
		});

		const channel = await Channel.findById(message.channelId).populate("members");

		const finalData = { ...messageData.toObject(), channelId: channel._id };

		if (channel && channel.members) {
			channel.members.forEach((member) => {
				const memberSocketId = userSocketMap.get(member._id.toString());
				if (memberSocketId) io.to(memberSocketId).emit("recieve-channel-message", finalData);
			});

			const adminSocketId = userSocketMap.get(channel.admin._id.toString());
			if (adminSocketId) io.to(adminSocketId).emit("recieve-channel-message", finalData);
		}
	};

	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User with id ${userId} connected with socket id ${socket.id}`);
		} else {
			console.log("Connection failed");
		}

		socket.on("sendMessage", (message) => sendMessage(message));
		socket.on("send-channel-message", (message) => sendChannelMessage(message));

		socket.on("disconnect", () => disconnect(socket));
	});
};

export default setUpSocket;
