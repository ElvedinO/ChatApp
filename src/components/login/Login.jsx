import React, { useState, useRef } from 'react';
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

  const registerFormRef = useRef(null);
  const loginFormRef = useRef(null);

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

      toast.success('Account created. You can login now.');

      registerFormRef.current.reset();
      setavatar({ file: null, url: '' });
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
      toast.success('You logged in successfully');
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login w-full h-full flex items-center gap-24 justify-center '>
      <div className='item border-l border-r border-lightgray rounded-2xl p-12  max-w-fit'>
        <h2 className='text-xl font-bold'>Welcome</h2>
        <form ref={loginFormRef} onSubmit={handleLogin}>
          <input
            className=' placeholder-lightgray outline-none'
            type='text'
            placeholder='Email'
            name='email'
          />
          <input
            className=' outline-none placeholder-lightgray'
            type='password'
            placeholder='Password'
            name='password'
          />
          <button
            disabled={loading}
            className='text-darkgray max-w-fit px-5 py-2 bg-blueish  rounded-2xl font-bold'
          >
            {loading ? 'Loading...' : 'Sign In'}
          </button>
        </form>
      </div>
      <div className='seperator h-4/5 w-[2px] bg-bordergray'></div>
      <div className='item p-12 max-w-fit border-l border-r border-lightgray rounded-2xl'>
        <h2 className='text-xl font-bold'>Create an Account</h2>
        <form ref={registerFormRef} onSubmit={handleRegister} action=''>
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
          <input
            className='outline-none placeholder-lightgray'
            type='text'
            placeholder='Username'
            name='username'
          />
          <input
            className='outline-none placeholder-lightgray'
            type='text'
            placeholder='Email'
            name='email'
          />
          <input
            className='outline-none placeholder-lightgray'
            type='password'
            placeholder='Password'
            name='password'
          />
          <button
            disabled={loading}
            className='text-darkgray max-w-fit px-5 py-2 bg-blueish  rounded-2xl font-bold'
          >
            {loading ? 'Loading...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
