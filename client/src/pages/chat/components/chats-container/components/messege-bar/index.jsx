import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from 'react-icons/ri'
import { IoSend } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '../../../../../../context/SocketContext';
import { useAppStore } from '../../../../../../store';
import apiClients from '../../../../../../lib/api-clients';
import { UPLOAD_FILES_ROUTE } from '../../../../../../utils/constants';


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

  const handleSendMessage = async () => {
    // console.log("sending message")
    if (!message || message.trim() === "") {
      console.log("Cannot send an empty message");
      return; // Prevent sending empty messages
    }

    if (selectedChatType === "Contact") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      })
    } else if (selectedChatType === "Channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        messageType: "text",
        fileUrl: undefined,
        channelId: selectedChatData._id,
      })

    }
    setMessage("");


  }



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
          if (selectedChatType === "DM") {
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

      </div>
      <button className='focus:outline-none focus:border-none focus:text-white bg-[#8417ff] flex items-center justify-center p-5 rounded-md  duration-300 hover:bg-[#741bda] transition-all focus:bg-[#741bda]' onClick={handleSendMessage}>
        <IoSend className='text-2xl' />
      </button>
    </div>
  )
}

export default MessageBar
