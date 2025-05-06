import ChatHeader from "./components/chat-header"
import MessegeBar from "./components/messege-bar"
import MessegeContainer from "./components/messegse-container"


const ChatsContainer = () => {
  return (
    <div className="fixed h-[100vh] w-[100vw] top-0 bg-[#1c1d25] flex flex-col md:static md:flex-1">
      <ChatHeader />
      <MessegeContainer />
      <MessegeBar />
       
    </div>
  )
}

export default ChatsContainer
