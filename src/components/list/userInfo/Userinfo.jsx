import React from 'react';
import { useUserStore } from '../../../lib/userStore';

const Userinfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className='p-5 flex items-center justify-between'>
      <div className='flex gap-5 items-center'>
        <img
          className='w-12 h-12 rounded-full object-cover'
          src={currentUser.avatar || '../images/avatar.png'}
          alt=''
        />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className='flex gap-5'>
        <img className='w-5 cursor-pointer' src='../images/more.png' alt='' />
        <img className='w-5 cursor-pointer' src='../images/video.png' alt='' />
        <img className='w-5 cursor-pointer' src='../images/edit.png' alt='' />
      </div>
    </div>
  );
};

export default Userinfo;
