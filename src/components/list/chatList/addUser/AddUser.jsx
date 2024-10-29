import React, { useState } from 'react';
import { db } from '../../../../lib/firebase';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useUserStore } from '../../../../lib/userStore';

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get('username');

    try {
      const userRef = collection(db, 'users');

      const q = query(userRef, where('username', '==', username));

      const querySnapShot = await getDocs(q);

      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async () => {
    const chatRef = collection(db, 'chats');
    const userChatsRef = collection(db, 'userchats');

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className='addUser p-3 bg-midnight rounded-2xl absolute top-0 bottom-0 left-0 right-0 m-auto w-max h-max'>
      <form action='' className='flex ' onSubmit={handleSearch}>
        <input
          className='bg-darkgray p-3 rounded-2xl rounded-tr-none rounded-br-none outline-none placeholder-lightgray'
          type='text'
          placeholder='Add a friend...'
          name='username'
        />
        <button className=' px-3 rounded-2xl rounded-tl-none rounded-bl-none  bg-[#48A6C3]'>
          Search
        </button>
      </form>
      {user && (
        <div className='user mt-12 flex items-center justify-between'>
          <div className='detail flex items-center gap-5'>
            <img
              className='w-12 h-12 rounded-full object-cover'
              src={user.avatar || '../images/avatar.png'}
              alt=''
            />
            <span>{user.username}</span>
          </div>
          <button
            className=' px-3 rounded-2xl bg-[#48A6C3]'
            onClick={handleAdd}
          >
            Add user
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
