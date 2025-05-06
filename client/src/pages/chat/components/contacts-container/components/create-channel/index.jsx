import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState,useEffect } from "react"
import { FaPlus } from "react-icons/fa"
import {
    Dialog,
    DialogContent,

    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "../../../../../../components/ui/input"

import { CREATE_CHANNEL, GET_ALL_CONTACTS } from "../../../../../../utils/constants.js"
import apiClients from "../../../../../../lib/api-clients.js"

import { useAppStore } from "../../../../../../store/index.js"
import {Button} from "@/components/ui/button"
import {MultipleSelector} from "../../../../../../components/ui/multipleselect"


const CreateChannel = () => {

    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
    const [newChannelModel, setnewChannelModel] = useState(false);

    const [allContacts, setallContacts] = useState([]);
    const [selectedContacts, setselectedContacts] = useState([]);   
    const [channelName, setchannelName] = useState("")

    useEffect(()=>{
        const getData = async ()=>{
            const response = await apiClients.get(GET_ALL_CONTACTS,{withCredentials:true});
            console.log("Contacts",response.data.contacts);
            setallContacts(response.data.contacts);

        }
        getData();
    },[]);

   const createChannel = async ()=>{

    try{

        if(channelName.length > 0 && selectedContacts.length > 0){

            const response = await apiClients.post(CREATE_CHANNEL,{
                name : channelName,
                members : selectedContacts.map((contact)=> contact.value)
            },{withCredentials : true});

            if(response.status === 201){
                setchannelName("")
                setselectedContacts([]);
                setnewChannelModel(false);
                addChannel(response.data.channel);
            }

        }

    }catch(error){
        console.log({error});
    }

   }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger><FaPlus className="text-neutral-400 transition-all duration-300 text-opacity-90 font-light text-sm hover:text-neutral-100" onClick={() => { setnewChannelModel(true) }} /></TooltipTrigger>
                    <TooltipContent>
                        <p>Create New Channel</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModel} onOpenChange={setnewChannelModel}>

                <DialogContent className="bg-[#181920] text-white border-none flex flex-col h-[400px] w-[400px]">
                    <DialogHeader className="items-center">
                        <DialogTitle>Please fill the details to create a channel</DialogTitle>

                    </DialogHeader>
                    <div>
                        <Input placeholder="Channel Name" className="bg-[#2c2e3b] p-6 border-none rounded-lg" onChange={(e) => setchannelName(e.target.value)} value={channelName} />
                    </div>
                    <div>
                    {
                        console.log("All Contacts",allContacts) 
                    }
                        <MultipleSelector className="rounded-full bg-[#2c2e3b] border-none py-2 text-white"
                         defaultOptions = {allContacts}
                         placeholder="Search Contacts"
                         value={selectedContacts} 
                         onChange={setselectedContacts} 
                         
                         emptyIndicator = {
                            <p className="text-center text-lg leading-10 text-gray-500" >No Results Found</p>
                         }
                         />
                    </div>
                    <div>

                    <Button className="w-full transition-all duration-300 bg-purple-500 hover:bg-purple-900" onClick={createChannel}>Create new Channel</Button>
                    </div>


                </DialogContent>
            </Dialog>


        </>
    )
}

export default CreateChannel
