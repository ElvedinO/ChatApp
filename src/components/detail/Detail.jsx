import React, { useState, useEffect } from 'react';
import { auth, db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useUserStore } from '../../lib/userStore';

const Detail = () => {
  const {
    chatId,
    user,
    isCurrentUserBlocked,
    isReceiverBlocked,
    changeBlock,
    resetChat,
  } = useChatStore();
  const { currentUser } = useUserStore();

  const [isMediaVisible, setIsMediaVisible] = useState(true);
  const [isArrowRotated, setIsArrowRotated] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (doc) => {
      const chatData = doc.data();
      if (chatData && chatData.messages) {
        const images = chatData.messages
          .filter((message) => message.img)
          .map((message) => message.img);
        setImageUrls(images);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, 'users', currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      changeBlock();
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    auth.signOut();
    resetChat();
  };

  const toggleMediaVisibility = () => {
    setIsMediaVisible(!isMediaVisible);
    setIsArrowRotated(!isArrowRotated);
  };

  const downloadImage = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank'; // Open in a new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='flex-[1] overflow-scroll no-scrollbar'>
      <div className='user py-7 px-5 flex flex-col items-center gap-4 border-b border-bordergray text-center'>
        <img
          className='w-24 h-24 object-cover rounded-full'
          src={user?.avatar || '../images/avatar.png'}
          alt=''
        />
        <h2>{user?.username}</h2>
      </div>
      <div className='info p-5 flex flex-col gap-6'>
        <div className='option'>
          <div className='title' onClick={toggleMediaVisibility}>
            <span className='cursor-pointer'>Media</span>
            <img
              className={`arrowIcons ${isArrowRotated ? 'rotate-180' : ''}`}
              src='../images/arrowDown.png'
              alt=''
              style={{
                transform: isArrowRotated ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </div>
          <div
            className='photos grid grid-cols-2 gap-5 mt-5 overflow-hidden transition-max-height duration-300'
            style={{
              maxHeight: isMediaVisible ? '500px' : '0',
              transition: 'max-height 0.3s ease-in-out',
            }}
          >
            {imageUrls.map((url, index) => (
              <div className='photoItem' key={index}>
                <div className='photoDetail relative'>
                  <img
                    className='w-40 h-40 object-cover'
                    src={url}
                    alt={`Chat ${index}`}
                  />
                  <div
                    className='imageDownload absolute top-2 right-2 bg-[#48A6C3] rounded-full cursor-pointer'
                    onClick={() => downloadImage(url)}
                  >
                    <img
                      className='w-6 h-6 p-1'
                      src='../images/download.png'
                      alt=''
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='flex flex-col p-5 gap-5 border-t border-bordergray'>
        <button
          className='py-3 px-5 bg-red-500 rounded-2xl cursor-pointer hover:bg-red-700 transition-all duration-300'
          onClick={handleBlock}
        >
          {isCurrentUserBlocked
            ? 'You are blocked!'
            : isReceiverBlocked
            ? 'User blocked'
            : 'Block User'}
        </button>
        <button
          className='text-darkgray p-2 bg-[#48A6C3] rounded-2xl cursor-pointer hover:bg-[#32778b] transition-all duration-300'
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
