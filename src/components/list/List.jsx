import React, { useState } from 'react';
import Userinfo from './userInfo/Userinfo';
import ChatList from './chatList/ChatList';

const List = () => {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className='flex flex-col '>
      <Userinfo toggleVisibility={toggleVisibility} isVisible={isVisible} />
      {isVisible && <ChatList />}
    </div>
  );
};

export default List;
