import React, { useEffect } from 'react'
import { useAppStore } from '../../store'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ChatsContainer from './components/chats-container';
import ContactsContainer from './components/contacts-container';
import EmptyChatsContainer from './components/empty-chats-container';


const Chat = () => {


  const {userInfo,
    selectedChatType,  
    isUploading ,
    isDownloading ,
    fileUploadProgress ,
    fileDownloadProgress } = useAppStore();

  const navigate = useNavigate();

  useEffect(()=>{

    if(!userInfo.profileSetup){
      toast("Please set up your profile");
      navigate("/profile")
    }

  },[userInfo,navigate])

  return (
    <div className='h-[100vh] w-[100vw] flex overflow-hidden text-white'>
    {
      isUploading && (
        <div className='fixed top-0 z-10 h-[100vh] w-[100vw] bg-black/80 flex justify-center items-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Uplaoding File</h5>
          {fileUploadProgress}%
        </div>
      )
    }
    {
      isDownloading && (
        <div className='fixed top-0 z-10 h-[100vh] w-[100vw] bg-black/80 flex justify-center items-center flex-col gap-5 backdrop-blur-lg'>
          <h5 className='text-5xl animate-pulse'>Downloading   File</h5>
          {fileDownloadProgress}%
        </div>
      )
    }
      <ContactsContainer />

      {
        selectedChatType === undefined ? (<EmptyChatsContainer />) : (<ChatsContainer />)
      }
     
    </div>
  )
}

export default Chat
