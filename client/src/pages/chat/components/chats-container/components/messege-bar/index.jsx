import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '../../../../../../context/SocketContext';
import { useAppStore } from '../../../../../../store';
import apiClients from '../../../../../../lib/api-clients';
import { UPLOAD_FILES_ROUTE } from '../../../../../../utils/constants';
import VoiceRecorder from '../../../../../../components/VoiceRecorder';


const MessageBar = () => {


  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const { userInfo, selectedChatData, selectedChatType, setIsUploading, setFileUplaodProgress } = useAppStore();
  const [message, setMessage] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);



  useEffect(() => {

    function handleMouseOutside(event) {

      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleMouseOutside);
    return () => {
      document.removeEventListener("mousedown", handleMouseOutside);
    }

  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  // const handleSendMessage = async () => {
    
  //   // console.log("sending message")
  //   if (!message || message.trim() === "") {
  //     console.log("Cannot send an empty message");
  //     return; // Prevent sending empty messages
  //   }

  //   if (selectedChatType === "Contact") {
      
  //     socket.emit("sendMessage", {
  //       sender: userInfo.id,
  //       content: message,
  //       recipient: selectedChatData._id,
  //       messageType: "text",
  //       fileUrl: undefined, 
  //       text: inputValue

      
  //     })
  //   } else if (selectedChatType === "Channel") {
  //     socket.emit("send-channel-message", {
  //       sender: userInfo.id,
  //       content: message,
  //       messageType: "text",
  //       fileUrl: undefined,
  //       channelId: selectedChatData._id,
  //     })

  //   }
  //   setMessage("");


  // }
  const handleSendMessage = async () => {
    // Prevent sending empty messages
    if (!message || message.trim() === "") {
      console.log("Cannot send an empty message");
      return;
    }
  
    // Base payload with text
    const payload = {
      sender: userInfo.id,
      text: message,           // use `text` so server.message.text is defined
      messageType: "text",
      fileUrl: undefined,
    };
  
    if (selectedChatType === "Contact") {
      socket.emit("sendMessage", {
        ...payload,
        recipient: selectedChatData._id,
      });
    } else if (selectedChatType === "Channel") {
      socket.emit("send-channel-message", {
        ...payload,
        channelId: selectedChatData._id,
      });
    }
  
    // Clear the input
    setMessage("");
  };
  



  const handleFileAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const handleFileAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);

        const response = await apiClients.post(UPLOAD_FILES_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUplaodProgress(Math.round((100 * data.loaded) / data.total));
          },
        });



        if (response.status === 200 && response.data) {
          setIsUploading(false);

          // Emit based on chat type
          if (selectedChatType === "Contact") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "Channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              messageType: "file",
              fileUrl: response.data.filePath,
              channelId: selectedChatData._id,
            });
          }
        }
      }

      console.log({ file });
    } catch (error) {
      setIsUploading(false);
      console.error("File Upload Error:", error);
    }
  };

  const handleRecordingComplete = async (audioBlob) => {
    if (!audioBlob) return;

    const formData = new FormData();
    const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
    formData.append("audio", file);
    formData.append("sender", userInfo.id); // assuming you have user info

    try {
      const res = await fetch("http://localhost:5000/upload/audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const fileUrl = data.fileUrl;

      // Send to recipient/channel using Socket.IO
      if (selectedChatType === "Contact") {
        socket.emit("sendMessage", {
          sender: userInfo.id,
          recipient: selectedChatData._id,
          messageType: "audio",
          fileUrl,
        });
      } else if (selectedChatType === "Channel") {
        socket.emit("send-channel-message", {
          sender: userInfo.id,
          channelId: selectedChatData._id,
          messageType: "audio",
          fileUrl,
        });
      }

    } catch (err) {
      console.error("Failed to upload and send audio:", err);
    }
  };

  // const handleRecordingComplete = async (audioBlob) => {
  //   if (!audioBlob) return;
  
  //   const formData = new FormData();
  //   const file = new File([audioBlob], "audio.webm", { type: "audio/webm" });
  
  //   formData.append("audio", file);
  //   formData.append("sender", userInfo.id);
  
  //   try {
  //     // 1. Upload audio
  //     const uploadRes = await fetch("http://localhost:5000/upload/audio/transcribe", {
  //       method: "POST",
  //       body: formData,
  //     });
  
  //     const uploadData = await uploadRes.json();
  //     const fileUrl = uploadData.fileUrl;
  
  //     // 2. Transcribe audio
  //     const transcribeForm = new FormData();
  //     transcribeForm.append("audio", file, "audio.webm");
  
  //     const transcribeRes = await fetch("http://localhost:5000/api/audio/transcribe", {
  //       method: "POST",
  //       body: transcribeForm,
  //     });
  
  //     const transcribeData = await transcribeRes.json();
  //     const rawText = transcribeData.text;
  
  //     // 3. Moderate text
  //     const moderationRes = await fetch("http://localhost:5000/moderate", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ text: rawText }),
  //     });
  
  //     const moderationData = await moderationRes.json();
  
  //     // 4. Check moderation action
  //     let finalText = rawText;
  //     if (moderationData.action === "block") {
  //       const labels = Object.keys(moderationData.top_scores).join(", ");
  //       finalText = `Message removed for violating guidelines (${labels})`;
  //     }
  
  //     // 5. Send audio message via Socket.IO
  //     const payload = {
  //       sender: userInfo.id,
  //       messageType: "audio",
  //       fileUrl,
  //       text: finalText,
  //     };
  
  //     if (selectedChatType === "Contact") {
  //       payload.recipient = selectedChatData._id;
  //       socket.emit("sendMessage", payload);
  //     } else if (selectedChatType === "Channel") {
  //       payload.channelId = selectedChatData._id;
  //       socket.emit("send-channel-message", payload);
  //     }

  //     socket.on("receiveMessage", (message) => {
  //       console.log("📩 Received message:", message);
  //     });
      
  
  //   } catch (err) {
  //     console.error("Failed to handle audio recording:", err);
  //   }
  // };
  
  

  return (
    <div className="h-[10vh] bg-[#1c1d25] flex items-center justify-center px-8 mb-6 gap-6">
      <div className="flex-1 flex items-center bg-[#2a2b33] rounded-md gap-5 pr-5">
        <input className="bg-transparent flex-1 rounded-md focus:outline-none focus:border-none p-5" placeholder="Enter a message" value={message} onChange={(e) => setMessage(e.target.value)} />

        <button className='focus:outline-none focus:border-none focus:text-white text-neutral-500 duration-300 transition-all' onClick={handleFileAttachmentClick}>

          <GrAttachment className='text-2xl' />

        </button>

        <input className='hidden' ref={fileInputRef} onChange={handleFileAttachmentChange} type='file' />
        <div className='relative'>
          <button className='focus:outline-none focus:border-none focus:text-white text-neutral-500 duration-300 transition-all' onClick={() => setShowEmojiPicker(true)}>
            <RiEmojiStickerLine className='text-2xl' />
          </button>
          <div className='absolute bottom-16 right-0' ref={emojiRef}>
            <EmojiPicker open={showEmojiPicker} theme='dark' onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        </div>


        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />


      </div>
      <button className='focus:outline-none focus:border-none focus:text-white bg-[#8417ff] flex items-center justify-center p-5 rounded-md  duration-300 hover:bg-[#741bda] transition-all focus:bg-[#741bda]' onClick={handleSendMessage}>
        <IoSend className='text-2xl' />
      </button>
    </div>
  )
}

export default MessageBar
