import React, { useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
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
            <span>Media</span>
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
          {isMediaVisible && (
            <div className='photos grid grid-cols-2 gap-5 mt-5'>
              <div className='photoItem'>
                <div className='photoDetail'>
                  <img
                    src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    alt=''
                  />
                </div>
              </div>
              <div className='photoItem'>
                <div className='photoDetail'>
                  <img
                    src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    alt=''
                  />
                </div>
              </div>
              <div className='photoItem'>
                <div className='photoDetail'>
                  <img
                    src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    alt=''
                  />
                </div>
              </div>
              <div className='photoItem'>
                <div className='photoDetail'>
                  <img
                    src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                    alt=''
                  />
                </div>
              </div>
            </div>
          )}
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
          className='p-2 bg-[#48A6C3] rounded-2xl cursor-pointer hover:bg-blue-700 transition-all duration-300'
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
