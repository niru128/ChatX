import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";
// import {exec} from "child_process";
// import path from "path";
import { fileURLToPath } from "url";

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

	// const __dirname = fileURLToPath(new URL('.', import.meta.url));

	// const sendMessage = async (message) => {
	// 	// console.log("Receiving message on server:", message);  // ✅ Check if this logs

	// 	const senderSocketId = userSocketMap.get(message.sender);
	// 	const recipientSocketId = userSocketMap.get(message.recipient);

	// 	// console.log("Sender Socket ID:", senderSocketId, "Recipient Socket ID:", recipientSocketId);  // ✅ Check if IDs are correct

	// 	const createdMessage = await Message.create(message);

	// 	const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color").populate("recipient", "id email firstName lastName image color");

	// 	if (recipientSocketId) {
	// 		console.log("Emitting to recipient:", recipientSocketId);
	// 		io.to(recipientSocketId).emit("receiveMessage", messageData);
	// 	}
	// 	if (senderSocketId) {
	// 		console.log("Emitting to sender:", senderSocketId);
	// 		io.to(senderSocketId).emit("receiveMessage", messageData);
	// 	}
	// };

	// const sendMessage = async (message) => {
	// 	console.log("🔥 sendMessage payload:", message);
	// 	// Call the moderation API to check the message
	// 	const response = await fetch("http://127.0.0.1:5000/moderate", {
	// 		method: "POST",
	// 		headers: {
	// 			"Content-Type": "application/json"
	// 		},
	// 		body: JSON.stringify({ text: message.text })		});
		
	// 	const moderationResult = await response.json();
	// 	console.log("Moderation result:", moderationResult);
	// 	console.log("Message text:", message.text);

		
	// 	// Check the moderation action
	// 	if (moderationResult.action === "block") {
	// 		message.text = "your message was deleted";  // Replace the message with the appropriate response
	// 	}
	
	// 	const senderSocketId = userSocketMap.get(message.sender);
	// 	const recipientSocketId = userSocketMap.get(message.recipient);
	
	// 	const createdMessage = await Message.create(message);
	
	// 	const messageData = await Message.findById(createdMessage._id)
	// 		.populate("sender", "id email firstName lastName image color")
	// 		.populate("recipient", "id email firstName lastName image color");
	
	// 	if (recipientSocketId) {
	// 		console.log("Emitting to recipient:", recipientSocketId);
	// 		io.to(recipientSocketId).emit("receiveMessage", messageData);
	// 	}
	// 	if (senderSocketId) {
	// 		console.log("Emitting to sender:", senderSocketId);
	// 		io.to(senderSocketId).emit("receiveMessage", messageData);
	// 	}
	// };
	
	// const sendMessage = async (message) => {
	// 	console.log("🔥 sendMessage payload:", message);
	  
	// 	let rawText = message.text;
	  
	// 	// 1. If messageType is audio, get text from transcription service
	// 	if (message.messageType === "audio" && message.fileUrl && !message.text) {
	// 	  try {
	// 		const formData = new FormData();
	// 		const audioBlob = await fetch(message.fileUrl).then(res => res.blob());
	// 		formData.append("audio", audioBlob, "audio.wav");
	  
	// 		const response = await fetch("http://127.0.0.1:5000/api/audio/transcribe", {
	// 		  method: "POST",
	// 		  body: formData,
	// 		});
	  
	// 		const data = await response.json();
	// 		rawText = data.text;
	// 		console.log("🎙️ Transcribed text:", rawText);
	// 		message.text = rawText; // Store for moderation & DB
	// 	  } catch (err) {
	// 		console.error("🛑 Failed to transcribe audio:", err);
	// 		rawText = ""; // Fallback to empty if transcription fails
	// 	  }
	// 	}
	  
	// 	// 2. Moderate only if there's valid text:
	// 	if (typeof rawText === "string" && rawText.trim()) {
	// 	  const response = await fetch("http://127.0.0.1:5000/moderate", {
	// 		method: "POST",
	// 		headers: { "Content-Type": "application/json" },
	// 		body: JSON.stringify({ text: rawText }),
	// 	  });
	  
	// 	  const moderationResult = await response.json();
	// 	  console.log("🧠 Moderation result:", moderationResult);
	  
	// 	  if (moderationResult.action === "block") {
	// 		message.text = "Message removed for violating guidelines" ;
	// 	  }
	// 	} else {
	// 	  console.warn("⚠️ No text to moderate; skipping moderation.");
	// 	}
	  
	// 	// 3. Build payload for DB:
	// 	const dbPayload = {
	// 	  sender: message.sender,
	// 	  recipient: message.recipient,
	// 	  content: message.text,
	// 	  messageType: message.messageType,
	// 	  fileUrl: message.fileUrl,
	// 	  timeStamps: new Date(),
	// 	};
	  
	// 	const createdMessage = await Message.create(dbPayload);
	// 	const messageData = await Message.findById(createdMessage._id)
	// 	  .populate("sender", "id email firstName lastName image color")
	// 	  .populate("recipient", "id email firstName lastName image color");
	  
	// 	// 4. Emit to both users:
	// 	const senderSocketId = userSocketMap.get(message.sender);
	// 	const recipientSocketId = userSocketMap.get(message.recipient);
	  
	// 	if (recipientSocketId) {
	// 	  io.to(recipientSocketId).emit("receiveMessage", messageData);
	// 	}
	// 	if (senderSocketId) {
	// 	  io.to(senderSocketId).emit("receiveMessage", messageData);
	// 	}
	//   };
	const sendMessage = async (message) => {
		console.log("🔥 sendMessage payload:", message);
	  
		let rawText = message.text;
	  
		// 1. If messageType is audio, get text from transcription service
		if (message.messageType === "audio" && message.fileUrl && !message.text) {
		  try {
			const formData = new FormData();
			const audioBlob = await fetch(message.fileUrl).then(res => res.blob());
			formData.append("audio", audioBlob, "audio.wav");
	  
			const response = await fetch("http://127.0.0.1:5000/api/audio/transcribe", {
			  method: "POST",
			  body: formData,
			});
	  
			const data = await response.json();
			rawText = data.text;
			console.log("🎙️ Transcribed text:", rawText);
			message.text = rawText; // Store for moderation & DB
		  } catch (err) {
			console.error("🛑 Failed to transcribe audio:", err);
			rawText = ""; // Fallback to empty if transcription fails
		  }
		}
	  
		// 2. Moderate only if there's valid text:
		if (typeof rawText === "string" && rawText.trim()) {
		  const response = await fetch("http://127.0.0.1:5000/moderate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ text: rawText }),
		  });
	  
		  const moderationResult = await response.json();
		  console.log("🧠 Moderation result:", moderationResult);
	  
		  if (moderationResult.action === "block") {
			message.text = "Message removed for violating guidelines";
		  }
		} else {
		  console.warn("⚠️ No text to moderate; skipping moderation.");
		}
	  
		// 3. Build payload for DB:
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
	  
		// 4. Emit to both users:
		const senderSocketId = userSocketMap.get(message.sender);
		const recipientSocketId = userSocketMap.get(message.recipient);
	  
		if (recipientSocketId) {
		  io.to(recipientSocketId).emit("receiveMessage", messageData);
		}
		if (senderSocketId) {
		  io.to(senderSocketId).emit("receiveMessage", messageData);
		}
	  };
	  
	  
	// const sendMessage = async (message) => {
	// 	const senderSocketId = userSocketMap.get(message.sender);
	// 	const recipientSocketId = userSocketMap.get(message.recipient);
	
	// 	try {
	// 		// Emit the message content to the Flask API for moderation
	// 		io.emit('moderateMessage', { text: message.content });
	
	// 		// Create a Promise that will resolve when the moderation result is received
	// 		const moderationResult = await new Promise((resolve, reject) => {
	// 			const timer = setTimeout(() => reject('Moderation timed out'), 15000);
	
	// 			io.once('moderateMessageResult', (result) => {
	// 				clearTimeout(timer);
	// 				resolve(result);
	// 			});
	// 		});
	
	// 		const { action } = moderationResult;
	// 		let finalMessage = message.content;
	
	// 		// Modify message based on moderation result
	// 		if (action === 'block') {
	// 			finalMessage = 'Your message got deleted';
	// 		}
	
	// 		// Save message to DB
	// 		const createdMessage = await Message.create({
	// 			...message,
	// 			content: finalMessage
	// 		});
	
	// 		// Retrieve full message data
	// 		const messageData = await Message.findById(createdMessage._id)
	// 			.populate("sender", "id email firstName lastName image color")
	// 			.populate("recipient", "id email firstName lastName image color");
	
	// 		// Emit the message to sender and recipient if they are connected
	// 		if (recipientSocketId) {
	// 			io.to(recipientSocketId).emit("receiveMessage", messageData);
	// 		}
	
	// 		if (senderSocketId) {
	// 			io.to(senderSocketId).emit("receiveMessage", messageData);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error during message moderation:", error);
	// 	}
	// };
	
	

	

	// const sendChannelMessage = async (message) => {
	// 	const { channelId, sender, content, messageType, fileUrl } = message;
	// 	const createdMessage = await Message.create({
	// 		sender,
	// 		recipient: null,
	// 		content,
	// 		messageType,
	// 		timeStamps: new Date(),
	// 		fileUrl
	// 	});

	// 	const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color ").exec();

	// 	console.log("populated message in backend", messageData)

	// 	await Channel.findByIdAndUpdate(channelId, {
	// 		$push: { messages: createdMessage._id },
	// 	});

	// 	const channel = await Channel.findById(channelId).populate("members");

	// 	const finalData = { ...messageData.toObject(), channelId: channel._id };

	// 	console.log("final data : ",finalData)

	// 	if (channel && channel.members) {
	// 		channel.members.forEach((member) => {
	// 			const memberSocketId = userSocketMap.get(member._id.toString());

	// 			if (memberSocketId) {
	// 				io.to(memberSocketId).emit("recieve-channel-message", finalData);
	// 			}
	// 		});
	// 		const adminSocketId = userSocketMap.get(channel.admin._id.toString());

	// 		if (adminSocketId) {
	// 			io.to(adminSocketId).emit("recieve-channel-message", finalData);
	// 		}
	// 	}

	// }
	const sendChannelMessage = async (message) => {
		console.log("🔥 sendChannelMessage payload:", message);
	  
		// 1. Extract raw text from the payload:
		const rawText = message.text;
	  
		// 2. Moderate if there is text:
		if (typeof rawText === "string" && rawText.trim()) {
		  try {
			const response = await fetch("http://127.0.0.1:5000/moderate", {
			  method: "POST",
			  headers: { "Content-Type": "application/json" },
			  body: JSON.stringify({ text: rawText }),
			});
			const moderationResult = await response.json();
			console.log("Moderation result:", moderationResult);
	  
			if (moderationResult.action === "block") {
			  // Replace text if blocked
			  message.text = "your message was deleted";
			}
		  } catch (err) {
			console.error("Error calling moderation API:", err);
			// You could choose to set message.text = "your message was deleted" or leave as-is.
		  }
		} else {
		  console.warn("No text to moderate; skipping moderation.");
		}
	  
		// 3. Build the DB payload, mapping text → content:
		const dbPayload = {
		  sender: message.sender,
		  recipient: null,
		  content: message.text,         // Mapped from message.text
		  messageType: message.messageType,
		  timeStamps: new Date(),
		  fileUrl: message.fileUrl,
		  channelId: message.channelId,  // make sure channelId is included here
		};
	  
		// 4. Save the message
		const createdMessage = await Message.create(dbPayload);
	  
		// 5. Populate sender info
		const messageData = await Message.findById(createdMessage._id)
		  .populate("sender", "id email firstName lastName image color")
		  .exec();
	  
		console.log("populated channel message:", messageData);
	  
		// 6. Add to channel
		await Channel.findByIdAndUpdate(message.channelId, {
		  $push: { messages: createdMessage._id },
		});
	  
		// 7. Fetch full channel with members & admin
		const channel = await Channel.findById(message.channelId).populate("members");
	  
		// 8. Build final payload
		const finalData = { ...messageData.toObject(), channelId: channel._id };
	  
		console.log("final channel message data:", finalData);
	  
		// 9. Emit to all members and admin
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
	  };
	  
	  

	io.on("connection", (socket) => {
		const userId = socket.handshake.query.userId;

		if (userId) {
			userSocketMap.set(userId, socket.id);
			console.log(`User with id ${userId} connected with socket id ${socket.id}`);
		} else {
			console.log("Connection failed");
		}

		socket.on("sendMessage", (message) => sendMessage(message, io));
		socket.on("send-channel-message", (message) => sendChannelMessage(message, io));


		socket.on("disconnect", () => disconnect(socket));
	});
};

export default setUpSocket;