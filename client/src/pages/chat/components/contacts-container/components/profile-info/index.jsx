import React from 'react'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useAppStore } from '../../../../../../store';
import { getColor } from '../../../../../../lib/utils';
import { HOST } from '../../../../../../utils/constants';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { FiEdit2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import {IoPowerSharp} from 'react-icons/io5'
import apiClients from '../../../../../../lib/api-clients';
import { LOGOUT_ROUTE } from '../../../../../../utils/constants';

const ProfileInfo = () => {

    const { userInfo,setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logOut = async ()=>{
        try{
            const response  = await apiClients.post(LOGOUT_ROUTE,{},{withCredentials:true});

            if(response.status === 200){
                navigate("/auth");
                setUserInfo(null);

            }
        }catch(error){
            console.log(error);
            
        }
    }

    return (
        <div className='absolute h-16 bottom-0 flex items-center justify-between w-full px-10 bg-[#2a2b33]'>
            <div className='flex gap-3 justify-center items-center'>

                <div className='w-12 h-12 relative'>
                    <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                        {
                            userInfo.image ? <AvatarImage src={`${HOST}/${userInfo.ima}`} alt="profile" className="w-full h-full object-cover bg-black rounded-full" /> : <div className={`uppercase h-12 w-12  text-lg border-[1px] flex justify-center items-center rounded-full ${getColor(userInfo.color)}`}>
                                {
                                    userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split("").shift()
                                }
                            </div>
                        }
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : userInfo.email
                    }
                </div>
            </div>
            <div className='flex gap-5'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><FiEdit2 className="text-purple-500 text-xl font-medium" onClick={()=>{navigate("/profile")}} /></TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger><IoPowerSharp className="text-red-500 text-xl font-medium" onClick={logOut} /></TooltipTrigger>
                        <TooltipContent>
                            <p>Log out</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo
