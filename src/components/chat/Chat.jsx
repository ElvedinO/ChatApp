import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');

  const { chatId } = useChatStore();

  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      onSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className='flex flex-col flex-[2] border-l border-r border-gray-600 h-full'>
      <div className='top p-5 flex items-center justify-between border-b border-gray-600'>
        <div className='user flex items-center gap-5 '>
          <img
            className='w-14 h-14 rounded-full object-cover'
            src='../images/avatar.png'
            alt=''
          />
          <div className='textsflex-col gap-1 '>
            <span className='text-lg font-medium'>Jane Doe</span>
            <p className='text-sm font-normal text-gray-400'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam
            </p>
          </div>
        </div>
        <div className='icons flex gap-5'>
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/phone.png'
            alt=''
          />
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/video.png'
            alt=''
          />
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/info.png'
            alt=''
          />
        </div>
      </div>
      <div className='center p-5 flex-1 overflow-scroll no-scrollbar flex flex-col gap-5 [&>.message]:max-w-[80%]'>
        {chat?.messages?.map((message) => (
          <div className='message own' key={message?.createAt}>
            <div className='msgContainer'>
              <div className='texts'>
                {message.img && <img src={message.img} alt='' />}
                <p>{message.text}</p>
              </div>
              {/* <span>{message.createdAt}</span> */}
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>
      <div
        className='bottom p-5 flex items-center justify-between gap-5
       border-t border-gray-600 mt-auto'
      >
        <div className='icons flex gap-5'>
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/img.png'
            alt=''
          />
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/camera.png'
            alt=''
          />
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/mic.png'
            alt=''
          />
        </div>
        <input
          className='flex-1 bg-midnight/50 p-5 rounded-xl text-white outline-none'
          type='text'
          placeholder='Type a message...'
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
        <div className='emoji relative'>
          <img
            className='w-5 h-5 cursor-pointer'
            src='../images/emoji.png'
            alt=''
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className='picker absolute bottom-12 left-0'>
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className='bg-blue-500 text-white px-5 py-2 rounded-md'>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
