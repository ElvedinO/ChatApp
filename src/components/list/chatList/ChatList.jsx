import React, { useState } from 'react';

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);

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
      <div className='item flex items-center gap-5 p-5 cursor-pointer border-b border-gray-600'>
        <img
          className='w-12 h-12 rounded-full object-cover'
          src='../images/avatar.png'
          alt=''
        />
        <div className='text flex flex-col gap-2'>
          <span className='font-medium'>Jance Doe</span>
          <p className='text-sm font-light'>Hello</p>
        </div>
      </div>
      <div className='item flex items-center gap-5 p-5 cursor-pointer border-b border-gray-700'>
        <img
          className='w-12 h-12 rounded-full object-cover'
          src='../images/avatar.png'
          alt=''
        />
        <div className='text flex flex-col gap-2'>
          <span className='font-medium'>Jance Doe</span>
          <p className='text-sm font-light'>Hello</p>
        </div>
      </div>
      <div className='item flex items-center gap-5 p-5 cursor-pointer border-b border-gray-700'>
        <img
          className='w-12 h-12 rounded-full object-cover'
          src='../images/avatar.png'
          alt=''
        />
        <div className='text flex flex-col gap-2'>
          <span className='font-medium'>Jance Doe</span>
          <p className='text-sm font-light'>Hello</p>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
