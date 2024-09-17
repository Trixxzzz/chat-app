import React from 'react'
import "./UserInfo.css"
import { useUserStore } from '../../../Lib/UserStore'

const UserInfo = () => {
  const {currentUser}=useUserStore();
  return (
    <div className='userInfo'>
        <div className="user">
        <img src={currentUser.avatar||"./avatar.png"} alt="logo" />
        <h2>{currentUser.username}</h2>
        </div>
        <div className="icons">
            <img src="./more.png" alt="logo" />
            <img src="./video.png" alt="logo" />
            <img src="./edit.png" alt="logo" />
        </div>
    </div>
  )
}

export default UserInfo