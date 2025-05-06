import React, { useState } from 'react'
import Background from "../../assets/login2.png"
import victory from "../../assets/victory.svg"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { toast } from "sonner"
import apiClients from '../../lib/api-clients'
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '../../utils/constants'
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/index';

const Auth = () => {


    const navigate = useNavigate();
    const {setUserInfo} = useAppStore();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const validateLogin = ()=>{
        if(email === ''){
            toast.error("Email is required")
            return false
        }
        if(password === ''){
            toast.error("Password is required")
            return false
        }
        return true
    }

    const validateSignUP = ()=>{
        if(email === ''){
            toast.error("Email is required")
            return false
        }
        if(password === ''){
            toast.error("Password is required")
            return false
        }
        if(confirmPassword !== password){
            toast.error("password and confirm password should be the same")
            return false
        }
        return true
    }

    const handleLogin = async () => {
        if(validateLogin()){
            try{

                console.log("Login Payload", {email, password});
                const response = await apiClients.post(LOGIN_ROUTE, {email, password},{withCredentials:true});
                
                if(response.data.user.id){ 
                    setUserInfo(response.data.user)
                    console.log("Navigating")
    
                    if(response.data.user.profileSetup){
                        navigate('/chat');
                    }else{
                        navigate("/profile")
                    }
                }
    
                console.log({response})

            }catch(error){
                console.log({error});
                toast.error("An error occured");
            }
        }

    }

    const handleSignUp = async () => {
        if(validateSignUP()){
            try{

                const response = await apiClients.post(SIGNUP_ROUTE, {email, password},{withCredentials:true});
                if(response.status===201){
                    setUserInfo(response.data.user)
                    console.log("Navigating")
                    navigate("/profile")
                }
                console.log({response});
            }catch(error){
                console.log({error});
                toast.error("An error occured");    
            }
        }
    }

    return (
        <div className='flex justify-center items-center h-[100vh] w-[100vw]'>

            <div className='h-[80vh] border-2 border-white w-[80vw] bg-white text-opacity-90 shadow-2xl md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>

                <div className='flex justify-center items-center flex-col gap-10'>

                    <div className='flex flex-col justify-center items-center'>

                        <div className='flex justify-center items-center'>
                            <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                            <img src={victory} alt='victory emoji' className='h-[100px]' />
                        </div>

                        <p className='text-center font-medium'>Fill in the details to get started with our app</p>

                    </div>
                    <div className='flex items-center justify-center w-full'>

                        <Tabs className="w-3/4" defaultValue="login">

                            <TabsList className="bg-transparent rounded-none w-full">

                                <TabsTrigger value="login" className="data-[state=active]: bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>

                                <TabsTrigger value="signup" className="data-[state=active]: bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Sign Up</TabsTrigger>

                            </TabsList>

                            <TabsContent value="login" className="flex flex-col gap-5 mt-9">

                                <Input placeholder="Email" value={email} type="email" className="rounded-full p-6" onChange={(e) => setEmail(e.target.value)} />

                                <Input placeholder="Password" value={password} type="Password" className="rounded-full p-6" onChange={(e) => setPassword(e.target.value)} />

                                <Button className='p-6 rounded-full' onClick={handleLogin}>Login</Button>
                                
                            </TabsContent>
                            <TabsContent value="signup" className="flex flex-col gap-5">

                                <Input placeholder="Email" value={email} type="email" className="rounded-full p-6" onChange={(e) => setEmail(e.target.value)} />

                                <Input placeholder="Password" value={password} type="Password" className="rounded-full p-6" onChange={(e) => setPassword(e.target.value)} />

                                <Input placeholder="confirmPassword" value={confirmPassword} type="password" className="rounded-full p-6" onChange={(e) => setConfirmPassword(e.target.value)} />

                                <Button className='p-6 rounded-full' onClick={handleSignUp}>Sign Up</Button>


                            </TabsContent>

                        </Tabs>

                    </div>

                </div>

                <div className='hidden xl:flex justify-center items-center'>
                    <img className='h-[550px]' src={Background} />
                </div>
            </div>

        </div>
    )
}

export default Auth
