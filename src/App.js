import React, { useEffect } from 'react'
import List from './Components/List/List'
import Chat from './Components/Chat/Chat'
import Detail from './Components/Detail/Detail'
import Login from './Components/Login/Login'
import Notification from './Components/Notification/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './Lib/Firebase'
import { useUserStore } from './Lib/UserStore'
import { useChatStore } from './Lib/ChatStore'

const App = () => {

  const {currentUser,isLoading,fetchUserInfo}=useUserStore()
  const {chatId}=useChatStore()

  useEffect(() => {
   const unSub=onAuthStateChanged(auth,(user)=>{
    fetchUserInfo(user?.uid)
   })
   return ()=>{
    unSub()
   }
  }, [fetchUserInfo]);
  
  if(isLoading)return <div className='loading'>Loading...</div>

  return (
    <div className='container'>
      {currentUser?(
        <>
      <List/>
      {chatId && <Chat/>}
      {chatId && <Detail/> }
        </>
      ):
    (<Login/>)}
    <Notification/>
    </div>
  )
}

export default App