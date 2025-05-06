import { createContext, useContext, useEffect, useRef } from "react";
import { useAppStore } from "../store";
import { io } from "socket.io-client";
import { HOST } from "../utils/constants.js";

const SocketContext = createContext(null);

export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    
    const socket  = useRef();
    const {userInfo} = useAppStore();
 
    
    useEffect(()=>{
        if(userInfo){
            socket.current = io(HOST,{
                withCredentials : true,
                query : {userId : userInfo.id},
            });

            socket.current.on("connect",() =>{
                console.log("Connected to server");
            });

            const handleRecieveMessage = (message) => {
                const { selectedChatData, selectedChatType, addMessage,addContactsInDMContacts } = useAppStore.getState();
            
                console.log("Sender id:", message.sender._id);
                console.log("sender file", message.sender.fileUrl)
            
                if (
                    selectedChatType !== undefined &&
                    (
                         selectedChatData._id === message.sender._id ||
                         selectedChatData._id === message.recipient._id
                    )
                ) {
                    console.log("message rv:", message);
                    addMessage(message);
                }
                addContactsInDMContacts(message)
            };

            const handleRecieveChannelMessage = (message)=>{
                const {selectedChatData,selectedChatType,addMessage,addChannelInChannelList} = useAppStore.getState();



                if(selectedChatType !== undefined && selectedChatData._id === message.channelId){
                    addMessage(message);
                    console.log("recieved channel message in frontend", message);
                }

                addChannelInChannelList(message);

            }

            socket.current.on("receiveMessage",handleRecieveMessage);
            socket.current.on("recieve-channel-message",handleRecieveChannelMessage)

            return ()=>{
                socket.current.disconnect();
            }
        };
    },[userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    );
};
