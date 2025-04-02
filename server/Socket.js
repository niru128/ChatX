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
		// console.log("Receiving message on server:", message);  // ✅ Check if this logs

		const senderSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);

		// console.log("Sender Socket ID:", senderSocketId, "Recipient Socket ID:", recipientSocketId);  // ✅ Check if IDs are correct

		const createdMessage = await Message.create(message);

		const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color").populate("recipient", "id email firstName lastName image color");

		if (recipientSocketId) {
			console.log("Emitting to recipient:", recipientSocketId);
			io.to(recipientSocketId).emit("receiveMessage", messageData);
		}
		if (senderSocketId) {
			console.log("Emitting to sender:", senderSocketId);
			io.to(senderSocketId).emit("receiveMessage", messageData);
		}
	};

	const sendChannelMessage = async (message) => {
		const { channelId, sender, content, messageType, fileUrl } = message;
		const createdMessage = await Message.create({
			sender,
			recipient: null,
			content,
			messageType,
			timeStamps: new Date(),
			fileUrl
		});

		const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color ").exec();

		console.log("populated message in backend", messageData)

		await Channel.findByIdAndUpdate(channelId, {
			$push: { messages: createdMessage._id },
		});

		const channel = await Channel.findById(channelId).populate("members");

		const finalData = { ...messageData.toObject(), channelId: channel._id };

		console.log("final data : ",finalData)

		if (channel && channel.members) {
			channel.members.forEach((member) => {
				const memberSocketId = userSocketMap.get(member._id.toString());

				if (memberSocketId) {
					io.to(memberSocketId).emit("recieve-channel-message", finalData);
				}
			});
			const adminSocketId = userSocketMap.get(channel.admin._id.toString());

			if (adminSocketId) {
				io.to(adminSocketId).emit("recieve-channel-message", finalData);
			}
		}

	}

	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User with id ${userId} connected with socket id ${socket.id}`);
		} else {
			console.log("Connection failed");
		}

		socket.on("sendMessage", sendMessage);
		socket.on("send-channel-message", sendChannelMessage);


		socket.on("disconnect", () => disconnect(socket));
	});
};

export default setUpSocket;