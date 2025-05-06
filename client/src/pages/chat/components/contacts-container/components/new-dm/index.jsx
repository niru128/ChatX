import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../../../../../../components/ui/input"
import Lottie from "react-lottie"
import { animationDefaultOptions } from "../../../../../../lib/utils"
import { SEARCH_CONTACT } from "../../../../../../utils/constants.js"
import apiClients from "../../../../../../lib/api-clients.js"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { getColor } from "@/lib/utils"
import { HOST } from "@/utils/constants.js"
import { Contact } from "lucide-react"
import { useAppStore } from "../../../../../../store/index.js"

const NewDM = () => {

    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [newContactModel, setnewContactModel] = useState(false);
    const [searchedContact, setsearchedContact] = useState([]);

    const searchContacts = async (searchTerm) => {
        try {

            if (searchTerm.length > 0) {
                const response = await apiClients.post(SEARCH_CONTACT, { searchTerm }, { withCredentials: true });

                if (response.status === 200 && response.data.contacts) {
                    console.log("Contacts", response.data.contacts);
                    setsearchedContact(response.data.contacts);
                }
            } else {
                setsearchedContact([])
            }

        } catch (error) {
            console.log(error)
        }
    }

    const selectNewContact = (contact) => {
        setnewContactModel(false);
        setSelectedChatType("Contact");
        setSelectedChatData(contact);
        setsearchedContact([]);

    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><FaPlus className="text-neutral-400 transition-all duration-300 text-opacity-90 font-light text-sm hover:text-neutral-100" onClick={() => { setnewContactModel(true) }} /></TooltipTrigger>
                    <TooltipContent>
                        <p>Select New Contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newContactModel} onOpenChange={setnewContactModel}>

                <DialogContent className="bg-[#181920] text-white border-none flex flex-col h-[400px] w-[400px]">
                    <DialogHeader className="items-center">
                        <DialogTitle>Please select a contact</DialogTitle>

                    </DialogHeader>
                    <div>
                        <Input placeholder="Search a contact" className="bg-[#2c2e3b] p-6 border-none rounded-lg" onChange={(e) => searchContacts(e.target.value)} />
                    </div>
                    {
                        searchedContact.length > 0 && (

                            <ScrollArea className="h-[250px]">
                                <div className="flex flex-col gap-5">
                                    {
                                        searchedContact.map((contact) => (
                                            <div key={contact._id} className="flex items-center gap-3 cursor-pointer" onClick={() => { selectNewContact(contact) }}>

                                                <div className='w-12 h-12 relative'>
                                                    <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                                                        {
                                                            contact.image ? <AvatarImage src={`${HOST}/${contact.ima}`} alt="profile" className="w-full h-full object-cover bg-black rounded-full" /> :
                                                                <div className={`uppercase h-12 w-12  text-lg border-[1px] flex justify-center items-center rounded-full ${getColor(contact.color)}`}>
                                                                    {
                                                                        contact.firstName ? contact.firstName.split("").shift() : contact.email.split("").shift()
                                                                    }
                                                                </div>
                                                        }
                                                    </Avatar>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span> {
                                                        contact.firstName && contact.lastName ? `${contact.firstName} ${contact.lastName}` : contact.email
                                                    }</span>
                                                    <span className="text-sm">{contact.email}</span>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            </ScrollArea>
                        )
                    }

                    {
                        searchedContact.length <= 0 && (
                            <div className="flex-1 md:flex flex-col  items-center justify-center   duration-1000 transition-all">
                                <Lottie
                                    height={100}
                                    width={100}
                                    isClickToPauseDisabled={true}
                                    options={animationDefaultOptions}
                                />
                                <div className="text-opacity-90 flex flex-col gap-5 text-white text-2xl mt-5 items-center text-center lg:text-3xl duration-300 transition-all">


                                    <h3 className="poppins-medium">
                                        Hi <span className="text-purple-500"> !</span> Search for a contact <span className="text-purple-500"></span>

                                    </h3>

                                </div>
                            </div>
                        )
                    }


                </DialogContent>
            </Dialog>


        </>
    )
}

export default NewDM
