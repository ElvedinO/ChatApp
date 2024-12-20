import React, { useEffect, useRef, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';
import Detail from '../detail/Detail'; // Import the Detail component

const Chat = () => {
  const [chat, setChat] = useState();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [img, setImg] = useState({ file: null, url: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDetailVisible, setIsDetailVisible] = useState(false); // State to manage Detail visibility

  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

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

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSend = async () => {
    if (text === '' && !img.file) return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file, setUploadProgress);
      }

      await updateDoc(doc(db, 'chats', chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, 'userchats', id);
        const userChatsSnapshot = await getDoc(userChatsRef);

        if (userChatsSnapshot.exists()) {
          const userChatsData = userChatsSnapshot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text || 'Image';
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setImg({
        file: null,
        url: '',
      });

      setText('');
      setUploadProgress(0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const toggleDetailVisibility = () => {
    setIsDetailVisible((prev) => !prev);
  };

  return (
    <>
      <div className='flex flex-col flex-[2]  h-full'>
        <div className='top p-5 flex items-center justify-between border-b border-bordergray'>
          <div className='user flex items-center gap-5 '>
            <img
              className='w-12 h-12 rounded-full object-cover'
              src={user?.avatar || '../images/avatar.png'}
              alt=''
            />

            <span className='text-xl font-bold'>{user?.username}</span>
          </div>
          <div className='icons flex gap-5'>
            <img
              className='w-5 h-5 cursor-pointer'
              src='../images/info.png'
              alt=''
              onClick={toggleDetailVisibility} // Toggle Detail visibility
            />
          </div>
        </div>
        <div className='center bg-[#0A0E0F] p-5 flex-1 overflow-scroll no-scrollbar flex flex-col gap-2 [&>.message]:max-w-[80%]'>
          {chat?.messages?.map((message) => (
            <div
              className={
                message.senderId === currentUser?.id ? 'message own' : 'message'
              }
              key={message?.createdAt}
            >
              <div className='msgContainer flex flex-col'>
                <div className='texts'>
                  {message.img && <img src={message.img} alt='' />}
                  {message.text && <p>{message.text}</p>}
                </div>
                <span className='text-xs text-lightgray'>
                  {new Date(message.createdAt.seconds * 1000).toLocaleString(
                    'en-US',
                    {
                      weekday: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  )}
                </span>
              </div>
            </div>
          ))}
          {img.url && (
            <div className='message own'>
              <div className='texts relative'>
                <img src={img.url} alt='' />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 '>
                  <span className='text-white absolute top-2/4'>
                    {uploadProgress}%
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={endRef}></div>
        </div>
        <div
          className='bottom p-2 md:p-5 flex items-center justify-between gap-1 md:gap-5
       border-t border-bordergray mt-auto'
        >
          <div className='icons flex gap-5'>
            <label htmlFor='file'>
              <img
                className='w-5 h-5 cursor-pointer'
                src='../images/camera.png'
                alt=''
              />
            </label>
            <input
              type='file'
              id='file'
              style={{ display: 'none' }}
              onChange={handleImg}
            />
          </div>
          <input
            className='flex-1 bg-darkgray p-4 rounded-xl text-white outline-none disabled:cursor-not-allowed placeholder-lightgray'
            type='text'
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "You can't send a message"
                : 'Type a message...'
            }
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            value={text}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <div className='emoji relative hidden md:block'>
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

          <button
            className='bg-[#48A6C3] text-darkgray px-5 py-2 rounded-2xl disabled:bg-red-600 disabled:cursor-not-allowed'
            onClick={handleSend}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          >
            Send
          </button>
        </div>
      </div>
      {isDetailVisible && chatId && <Detail />}
    </>
  );
};

export default Chat;
