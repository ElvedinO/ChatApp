import React from 'react';
import { auth } from '../../lib/firebase';

const Detail = () => {
  return (
    <div className='flex-[1] overflow-scroll no-scrollbar'>
      <div className='user py-7 px-5 flex flex-col items-center gap-4 border-b border-gray-600 text-center'>
        <img
          className='w-24 object-cover rounded-full'
          src='../images/avatar.png'
          alt=''
        />
        <h2>Jane Doe</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className='info p-5 flex flex-col gap-6  '>
        <div className='option'>
          <div className='title'>
            <span>Chat Settings</span>
            <img className='arrowIcons' src='../images/arrowUp.png' alt='' />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Privacy</span>
            <img className='arrowIcons' src='../images/arrowUp.png' alt='' />
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Photos</span>
            <img className='arrowIcons' src='../images/arrowDown.png' alt='' />
          </div>
          <div className='photos flex flex-col gap-5 mt-5'>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img
                  src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                  alt=''
                />
                <span>photo_2024</span>
              </div>
              <img className='downIcon' src='./images/download.png' alt='' />
            </div>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img
                  src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                  alt=''
                />
                <span>photo_2024</span>
              </div>
              <img className='downIcon' src='./images/download.png' alt='' />
            </div>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img
                  src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                  alt=''
                />
                <span>photo_2024</span>
              </div>
              <img className='downIcon' src='./images/download.png' alt='' />
            </div>
            <div className='photoItem'>
              <div className='photoDetail'>
                <img
                  src='https://images.pexels.com/photos/28927948/pexels-photo-28927948/free-photo-of-dramatic-canyon-landscape-on-remote-island.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
                  alt=''
                />
                <span>photo_2024</span>
              </div>
              <img className='downIcon' src='./images/download.png' alt='' />
            </div>
          </div>
        </div>
        <div className='option'>
          <div className='title'>
            <span>Shared Files</span>
            <img className='arrowIcons' src='../images/arrowUp.png' alt='' />
          </div>
        </div>
        <button className='py-3 px-5 bg-red-500 rounded cursor-pointer hover:bg-red-700 transition-all duration-300'>
          Block User
        </button>
        <button
          className='p-2 bg-blue-400 rounded cursor-pointer hover:bg-blue-700 transition-all duration-300'
          onClick={() => auth.signOut()}
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Detail;
