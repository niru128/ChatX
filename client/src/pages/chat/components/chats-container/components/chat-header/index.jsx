import { RiCloseFill } from "react-icons/ri"
import { useAppStore } from "../../../../../../store"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { HOST } from "@/utils/constants"

const ChatHeader = () => {

  const { closeChat, selectedChatData, selectedChatType } = useAppStore();


  return (
    <div className="h-[10vh] border-r-2 bg-[#2f303b] flex justify-between items-center px-20">
      <div className="flex gap gap-5 items-center justify-between w-full">
        <div className="flex items-center justify-center gap-3">
          <div className='w-12 h-12 relative'>
          {
            selectedChatType === "Contact" ? 

            (<Avatar className="w-12 h-12 rounded-full overflow-hidden">
              {
                selectedChatData.image ? <AvatarImage src={`${HOST}/${selectedChatData.image}`} alt="profile" className="w-full h-full object-cover bg-black rounded-full" /> :
                  <div className={`uppercase h-12 w-12  text-lg border-[1px] flex justify-center items-center rounded-full ${getColor(selectedChatData.color)}`}>
                    {
                      selectedChatData?.firstName ? selectedChatData.firstName.split("").shift() : selectedChatData.email.split("").shift()
                    }
                  </div>
              }
            </Avatar> ) : 
            (<div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full" >#</div>)
          }
          </div>
          <div>
            {
              selectedChatType === "Channel" ? selectedChatData.name :
              selectedChatType === "Contact" && selectedChatData.firstName && selectedChatData.lastName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email
            }
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className="focus:outline-none focus:border-none focus:text-white text-neutral-500 duration-300 transition-all" onClick={closeChat}   >
            <RiCloseFill className="text-3xl" />
          </button>
        </div>
      </div>

    </div>
  )
}

export default ChatHeader
