import React, { useEffect, useRef } from 'react'
import { useAppStore } from '../../store'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {IoArrowBack} from 'react-icons/io5';
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import {colors, getColor} from "../../lib/utils"
import {FaPlus,FaTrash} from "react-icons/fa"
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import apiClients from '../../lib/api-clients';
import { ADD_PROFILE_IMAGE, UPDATE_PROFILE_INFO,HOST,REMOVE_PROFILE_IMAGE } from '../../utils/constants';


const Profile = () => {

	const navigate = useNavigate();


	const {userInfo, setUserInfo} = useAppStore();
	const [firstName, setfirstName] = useState("");
	const [lastName, setlastName] = useState("");
	const [image,setImage] = useState(null);
	const [hovered,setHovered] = useState(false);
	const [selectedColor,setSelectedColor] = useState(0);
	const fileInputRef = useRef(null);


	useEffect(()=>{
		if(userInfo.profileSetup){
			setfirstName(userInfo.firstName);
			setlastName(userInfo.lastName);
			setSelectedColor(userInfo.color);
		}

		if(userInfo.image){
			setImage(`${HOST}/${userInfo.image}`)	
		}
	},[userInfo])
	const validateProfile = ()=>{
		if(!firstName){
			toast.error("First name is required");
			return false
		}
		if(!lastName){
			toast.error("Last name is required");
			return false
		}
		return true
	}

	const saveChanges = async ()=>{
		if(validateProfile()){
			try{
				const response = await apiClients.post(UPDATE_PROFILE_INFO,{firstName,lastName,color:selectedColor},{withCredentials:true});

				if(response.status === 200 && response.data){
					setUserInfo({...response.data})
					toast.success("Profile has been updated")
					navigate("/chat")
				}
			}catch(error){
				console.log(error);
			}
		}
	};

	const handleNavigate = ()=>{
		if(userInfo.profileSetup){
			navigate("/chat");
		}else{
			toast.error("Please setup your profile")
		}
	}

	useEffect(() => {
  if(userInfo.image){
    setImage(`${HOST}/${userInfo.image}`);
  } else {
    setImage(null);
  }
}, [userInfo.image]);


	const handlefileInputClick = ()=>{
		fileInputRef.current.click();
	}
	const handleImageChange =async (event)=>{
		const file = event.target.files[0];
		console.log(file)

		if(file){
			const formData  = new FormData();
			formData.append("profile-image",file)
			const response = await apiClients.post(ADD_PROFILE_IMAGE,formData,{withCredentials:true});

			if(response.status === 200 && response.data.image){
				setUserInfo({...userInfo,image:response.data.image})
				toast.success("Profile image updated succesfully ")
			}
		}
	};

	const handleImageDelete =async ()=>{
		try{
			const response = await apiClients.delete(REMOVE_PROFILE_IMAGE, {withCredentials:true});

			if(response.status === 200){
				setUserInfo({...userInfo,image:null})
				toast.success("Profile image removed succesfully")
				setImage(null)
			}
		}catch(error){
			console.log({error})
		}
	};
	return (
		<div className='bg-[#1b1c24] flex flex-col items-center justify-center h-[100vh] gap-10'>
			<div className='flex flex-col gap-10 h-[80vw] md:w-max'>
				<div onClick={handleNavigate}>
					<IoArrowBack className="text-white/90 text-4xl md:text-6xl cursor-pointer" />
				</div>

				<div className='grid grid-cols-2'>
					<div className='h-full w-32 md:w-48 relative flex justify-center items-center' onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}>

					 <Avatar className = "w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
							{
								image ? <AvatarImage src={image} alt="profile" className="w-full h-full object-cover bg-black rounded-full" /> : <div className={`uppercase h-32 w-32  md:h-48 md:w-48 text-5xl border-[1px] flex justify-center items-center rounded-full ${getColor(selectedColor)}`}>
									{
										firstName ? firstName.split("").shift() : userInfo.email.split("").shift()
									}
								</div>
							}
					 </Avatar>
					 {
						hovered && <div className='absolute inset-0 rounded-full bg-black/50 flex items-center justify-center ring-fuchsia-50 ' onClick={image ? handleImageDelete : handlefileInputClick }>
							{
								image ? <FaTrash className='text-white text-3xl cursor-pointer ' /> : <FaPlus className='text-white text-3xl cursor-pointer' />
							}
						</div>
					 }
					 <Input type='file' ref={fileInputRef} name='profile-image' className='hidden' onChange={handleImageChange} accept='.jpeg, .jpg, .png, .svg, .webp'/>
					</div>
					 <div className='flex flex-col min-w-32 md:min-w-64 gap-5 justify-center items-center'>

					 <div className='w-full'>
						<Input placeholder='email' disabled value={userInfo.email} className='bg-black text-white border-none p-6 ' />
					 </div>

					 <div className='w-full'>
						<Input placeholder='First Name' onChange={(e)=>setfirstName(e.target.value)}  value={firstName} className='bg-black text-white border-none p-6' />
					 </div>

					 <div className='w-full'>
						<Input placeholder='Last Name' onChange={(e)=> setlastName(e.target.value)} value={lastName} className='bg-black text-white border-none p-6' />
					 </div>
					 
					 <div className='w-full flex gap-5'>
						{
							colors.map((color,index)=> <div className={`${color} flex h-8 w-8 rounded-full transition-all duration-300 cursor-pointer ${selectedColor === index ? "outline outline-white/50 outline-1" :"" } `} key={index} onClick={()=>{setSelectedColor(index)}} >

							</div>)
						}
					 </div>

					 </div>
				</div>
				<div className='w-full'>
					<Button className='w-full bg-purple-700 cursor-pointer transition-all duration-300 h-16' onClick={saveChanges}>Save Changes</Button>
				</div>
			</div>
		</div>
	)
}

export default Profile
