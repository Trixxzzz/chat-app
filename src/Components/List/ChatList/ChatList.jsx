import React, { useEffect, useState } from 'react';
import './ChatList.css';
import AddUser from './AddUser/AddUser';
import { useUserStore } from '../../../Lib/UserStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../Lib/Firebase';
import { useChatStore } from '../../../Lib/ChatStore';

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [input, setInput] = useState("")

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser.id) return;

    const fetchChats = async () => {
      const unsub = onSnapshot(doc(db, 'userchats', currentUser.id), async (res) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, 'users', item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      });

      return () => {
        unsub();
      };
    };

    fetchChats();
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    const updatedChats = chats.map((item) => {
      if (item.chatId === chat.chatId) {
        return { ...item, isSeen: true };
      }
      return item;
    });

    const userChats = updatedChats.map(({ user, ...rest }) => rest);
    const userChatsRef = doc(db, 'userchats', currentUser.id);

    try {
      await updateDoc(userChatsRef, { chats: userChats });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.error(err);
    }
  };
  
  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );
  return (
    <div className='chatList'>
      <div className='search'>
        <div className='searchBar'>
          <img src='./search.png' alt='logo' />
          <input type='text' placeholder='Search...' onChange={(e)=>setInput(e.target.value)}/>
        </div>
        <img
          src={addMode ? './minus.png' : './plus.png'}
          alt='logo'
          className='add'
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {filteredChats.map((chat) => (
        <div
          className='item'
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe' }}
        >
          <img src={chat.user.blocked.includes(currentUser.id)?'./avatar.png':chat.user.avatar } alt='' />
          <div className='texts'>
            <span>{chat.user.blocked.includes(currentUser.id)?"User":chat.user.username}</span>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
