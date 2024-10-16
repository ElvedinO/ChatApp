import React from 'react';
import Userinfo from './userInfo/Userinfo';
import ChatList from './chatList/ChatList';

const List = () => {
  return (
    <div className='flex-1 flex flex-col'>
      <Userinfo />
      <ChatList />
    </div>
  );
};

export default List;
