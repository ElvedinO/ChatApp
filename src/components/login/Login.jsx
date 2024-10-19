import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../lib/upload';

const Login = () => {
  const [avatar, setavatar] = useState({ file: null, url: '' });

  const [loading, setLoading] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setavatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);

    const { username, email, password } = Object.fromEntries(formData);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, 'userchats', res.user.uid), {
        chats: [],
      });

      toast.success('Accout created. You can login now.');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('You logged in successfuly');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login w-full h-full flex items-center gap-24 '>
      <div className='item'>
        <h2>Welcome</h2>
        <form onSubmit={handleLogin}>
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button
            disabled={loading}
            className='w-full p-5 bg-blue-500 rounded-md font-medium'
          >
            {loading ? 'Loading' : ' Log In'}
          </button>
        </form>
      </div>
      <div className='seperator h-4/5 w-[2px] bg-gray-600'></div>
      <div className='item'>
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister} action=''>
          <label
            className='flex items-center gap-5 cursor-pointer underline'
            htmlFor='file'
          >
            <img
              className=' w-12 h-12 rounded-lg object-cover'
              src={avatar.url || '../images/avatar.png'}
              alt=''
            />
            Upload an Image
          </label>

          <input
            type='file'
            id='file'
            style={{ display: 'none' }}
            onChange={handleAvatar}
          />
          <input type='text' placeholder='Username' name='username' />
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button
            disabled={loading}
            className=' w-full p-5 bg-blue-500 rounded-md font-medium'
          >
            {loading ? 'Loading' : ' Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
