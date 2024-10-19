import React, { useState } from 'react';
import AddUser from './addUser/AddUser';
import { useUserStore } from '../../../lib/userStore';
import { useEffect } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);

  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, 'userchats', currentUser.id),
      async (res) => {
        const items = res.data().chats;

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, 'users', item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.data();

          return { ...item, user };
        });
        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.id]);

  const handleSelect = async (chat) => {
    changeChat(chat.chatId, chat.user);
  };
  return (
    <div className='flex-[1] overflow-scroll no-scrollbar'>
      <div className='flex items-center gap-5 p-5'>
        <div className='flex flex-row flex-[1] rounded-lg bg-midnight/50'>
          <img
            className='w-5 h-5 ml-2 self-center '
            src='../images/search.png'
            alt=''
          />
          <input
            className='bg-transparent border-none outline-none text-white flex-1 p-2'
            type='text'
            placeholder='Search'
          />
        </div>
        <img
          className='w-9 h-9 bg-midnight/50 p-2 rounded-xl cursor-pointer'
          src={addMode ? '../images/minus.png' : '../images/plus.png'}
          alt=''
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      {chats.map((chat) => (
        <div
          className='item flex items-center gap-5 p-5 cursor-pointer border-b border-gray-600'
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
        >
          <img
            className='w-12 h-12 rounded-full object-cover'
            src={chat.user.avatar || '../images/avatar.png'}
            alt=''
          />
          <div className='text flex flex-col gap-2'>
            <span className='font-medium'>{chat.user.username}</span>
            <p className='text-sm font-light'>{chat.lastMessage}</p>
          </div>
        </div>
      ))}

      {addMode && <AddUser />}
    </div>
  );
};

export default ChatList;
