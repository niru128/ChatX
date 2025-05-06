import { useAppStore } from "../store"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { HOST } from "../utils/constants";
import { getColor } from "../lib/utils";


const ContactList = ({ contacts, isChannel = false }) => {
    const { selectedChatData, setSelectedChatData, setSelectedChatType, setselectedChatMessages } = useAppStore();

    const handleClick = (Contact) => {
        if (isChannel) setSelectedChatType("Channel");
        else setSelectedChatType("Contact");

        setSelectedChatData(Contact);

        if (selectedChatData && selectedChatData._id !== Contact._id) {
            setselectedChatMessages([]);
        }

    }

    return (
        <div className="mt-5">
            {
                contacts.map((contact) => (
                    <div key={contact._id} className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#8417ff] hover:bg-[#8417ff]" : "hover:bg-[#f1f1f111"}`} onClick={() => handleClick(contact)} >
                        <div className="flex gap-5 items-center justify-start text-neutral-300">
                            {
                                !isChannel && <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                    {
                                        contact.image ? <AvatarImage src={`${HOST}/${contact.image}`} alt="profile" className="w-full h-full object-cover bg-black rounded-full" /> :
                                            <div className={`
                                             ${selectedChatData && selectedChatData._id === contact._id ? "bg-[#fffff22] border-2 border-white/70" : getColor(contact.color)}
                                            uppercase h-10 w-10  text-lg border-[1px] flex justify-center items-center rounded-full ${getColor(contact.color)}`}>
                                                {
                                                    contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                                                }
                                            </div>
                                    }
                                </Avatar>
                            }
                            {
                                isChannel && <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full" >#</div>
                            }
                            {
                                isChannel ? <span>{contact.name}</span>:<span>{`${contact.firstName} ${contact.lastName}`}</span>
                            }
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default ContactList
