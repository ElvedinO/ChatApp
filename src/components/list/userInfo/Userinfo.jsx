import React from 'react';
import { useUserStore } from '../../../lib/userStore';

const Userinfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className='p-5 flex items-center justify-between border-b border-bordergray'>
      <div className='flex gap-5 items-center'>
        <img
          className='w-12 h-12 rounded-full object-cover'
          src={currentUser.avatar || '../images/avatar.png'}
          alt=''
        />
        <div>
          <h2 className=''>{currentUser?.username}</h2>
          <p className='text-lightgray'>My Account</p>
        </div>
      </div>
      <div className='flex gap-5'>
        <img
          className='w-5 h-5 cursor-pointer rotate-90'
          src='../images/more.png'
          alt=''
        />
      </div>
    </div>
  );
};

export default Userinfo;
