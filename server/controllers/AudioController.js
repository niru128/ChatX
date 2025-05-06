import Message from "../models/MessageModel.js";

export const uploadAudio = async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;
    const audioBase64 = fileBuffer.toString("base64");
    const fileUrl = `data:audio/webm;base64,${audioBase64}`;

    const newMessage = await Message.create({
      sender: req.body.sender,
      messageType: "audio",
      fileUrl,
    });

    res.status(200).json({ fileUrl: newMessage.fileUrl });
  } catch (err) {
    console.error("❌ Audio upload error:", err);
    res.status(500).json({ error: "Audio upload failed" });
  }
};
