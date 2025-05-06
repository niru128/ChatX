import React, {  useEffect } from 'react'
import { Button } from "./components/ui/button"
import Auth from "./pages/auth/index"
import Chat from './pages/chat'
import Profile from './pages/profile'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppStore } from './store'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClients from './lib/api-clients'
import { GET_USER_INFO } from './utils/constants'


const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? children : <Navigate to="/auth" />
}

const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;
  return isAuthenticated ? <Navigate to="/chat" /> : children
}



const App = () => {

  const [loading, setLoading] = useState(true);

  const { userInfo, setUserInfo } = useAppStore();

  useEffect(() => {

    const getUserInfo = async () => {
      try{
        const response = await apiClients.get(GET_USER_INFO,{withCredentials:true});

        if(response.status === 200 && response.data.id){
          setUserInfo(response.data);
        }else{
          setUserInfo(undefined);
        }
        console.log({response})
      }
      catch(error){
        setUserInfo(undefined);
      }finally{
        setLoading(false);
      }
    }

    if (!userInfo) {
      getUserInfo();
    } else {
      setLoading(false);
    }
  }, [userInfo, setUserInfo])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/auth' element={<AuthRoute><Auth /></AuthRoute>}></Route>

          <Route path='/chat' element={<PrivateRoute><Chat /></PrivateRoute>}></Route>

          <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>}></Route>

          <Route path='*' element={<Navigate to="/auth" />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
