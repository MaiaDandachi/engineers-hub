import React, { useState } from 'react';

import { MenuIcon } from '@heroicons/react/outline';
import { useAppDispatch } from '../redux-features/hooks';
import { logout } from '../redux-features/users';

interface IHeaderProps {
  loggedInUserName: string | undefined;
}

export const Header: React.FC<IHeaderProps> = ({ loggedInUserName }) => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch(logout());
  };

  return (
    <nav
      className='
          flex
          items-center
          justify-between
          w-full
          px-4
          h-14
          text-lg text-gray-700
          bg-white
          shadow-md
        '
    >
      <div className='flex-grow'>
        <span className=' bg-purple-700 px-4 py-1.5 text-lg text-white font-medium leading-5'>EngineersHub</span>
      </div>
      <ul className={`flex justify-end  text-gray-700 flex-grow md:flex ${expanded ? 'block' : 'hidden'} `}>
        <li>
          <span className='text-purple-600 font-medium text-lg'>{loggedInUserName}</span>
        </li>
        <li>
          <button type='button' onClick={handleLogout}>
            <span className='ml-4 hover:text-purple-700 text-lg'>Logout</span>
          </button>
        </li>
      </ul>
      <button type='button' onClick={() => setExpanded(!expanded)} className='md:hidden ml-4 w-6 h-6 text-purple-700'>
        <MenuIcon />
      </button>
    </nav>
  );
};
