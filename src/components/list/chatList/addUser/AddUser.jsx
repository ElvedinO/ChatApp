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
    <div className='addUser p-8 bg-midnight/90 rounded-lg absolute top-0 bottom-0 left-0 right-0 m-auto w-max h-max'>
      <form action='' className='flex gap-5 ' onSubmit={handleSearch}>
        <input
          className='p-5 rounded-lg outline-none text-black'
          type='text'
          placeholder='Username'
          name='username'
        />
        <button className='p-5 rounded-lg bg-blue-500'>Search</button>
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
          <button className='p-2 rounded-lg bg-blue-500' onClick={handleAdd}>
            Add user
          </button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
