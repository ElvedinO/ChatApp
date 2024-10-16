import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Login = () => {
  const [avatar, setavatar] = useState({ file: null, url: '' });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setavatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    toast.success('Hello');
  };

  return (
    <div className='login w-full h-full flex items-center gap-24 '>
      <div className='item'>
        <h2>Welcome</h2>
        <form onSubmit={handleLogin}>
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button className='w-full p-5 bg-blue-500 rounded-md font-medium'>
            Log In
          </button>
        </form>
      </div>
      <div className='seperator h-4/5 w-[2px] bg-gray-600'></div>
      <div className='item'>
        <h2>Create an Account</h2>
        <form action=''>
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
          <input type='text' placeholder='Username' name='Username' />
          <input type='text' placeholder='Email' name='email' />
          <input type='password' placeholder='Password' name='password' />
          <button className=' w-full p-5 bg-blue-500 rounded-md font-medium'>
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
