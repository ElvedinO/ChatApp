import React, { useState } from 'react';
import AddUser from './addUser/AddUser';
import { useUserStore } from '../../../lib/userStore';
import { useEffect } from 'react';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [addMode, setAddMode] = useState(false);
  const [input, setInput] = useState('');

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
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatsRef = doc(db, 'userchats', currentUser.id);

    try {
      await updateDoc(userChatsRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (err) {
      console.log(err);
    }
  };

  const filteredChats = chats.filter((c) =>
    c.user.username.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className='flex-[1] overflow-scroll no-scrollbar'>
      <div className='flex items-center gap-5 p-5 '>
        <div className='flex flex-row flex-[1] rounded-2xl bg-darkgray p-1 relative'>
          <img
            className='w-5 h-5 ml-2 self-center '
            src='../images/search.png'
            alt=''
          />
          <input
            className='bg-transparent outline-none text-white flex-1 p-2 placeholder-lightgray'
            type='text'
            placeholder='Search or start new chat...'
            onChange={(e) => {
              setInput(e.target.value);
            }}
          />
          {addMode && <AddUser />}
        </div>
        <img
          className='w-9 h-9 bg-midnight/50 p-2 rounded-xl cursor-pointer'
          src={addMode ? '../images/minus.png' : '../images/plus.png'}
          alt=''
          onClick={() => setAddMode((prev) => !prev)}
        />
      </div>
      <h1 className='px-5 text-2xl font-bold'>Messages</h1>
      {filteredChats.map((chat) => (
        <div
          className='item flex items-center gap-5 p-5 cursor-pointer border-b border-bordergray'
          key={chat.chatId}
          onClick={() => handleSelect(chat)}
          style={{ backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe' }}
        >
          <img
            className='w-12 h-12 rounded-full object-cover'
            src={
              chat.user.blocked.includes(currentUser.id)
                ? '../images/avatar.png'
                : chat.user.avatar || '../images/avatar.png'
            }
            alt=''
          />
          <div className='text flex flex-col gap-2'>
            <span className='font-medium'>
              {chat.user.blocked.includes(currentUser.id)
                ? 'User'
                : chat.user.username}
            </span>
            <p className='text-sm text-lightgray font-light'>
              {chat.lastMessage}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
