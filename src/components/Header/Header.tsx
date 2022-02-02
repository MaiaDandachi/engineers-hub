import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { MenuIcon } from '@heroicons/react/outline';
import { BellIcon } from '@heroicons/react/solid';
import { useAppDispatch } from '../../redux-features/hooks';
import { logout } from '../../redux-features/users';
import { NotificationsList } from '../Notifications/NotificationsList';

interface IHeaderProps {
  loggedInUserName: string | undefined;
  socket: Socket<DefaultEventsMap> | null;
}

export const Header: React.FC<IHeaderProps> = ({ loggedInUserName, socket }) => {
  const [expanded, setExpanded] = useState(false);
  const [isNotificationsListOpen, setIsNotificationListOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    dispatch(logout());
  };

  useEffect(() => {
    socket?.on('getNotification', (data: { senderId: string; type: number }) => {
      console.log(`${data.senderId} liked your post`);
    });
  }, [socket]);

  return (
    <>
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
            <button type='button' onClick={() => setIsNotificationListOpen(!isNotificationsListOpen)}>
              <BellIcon className='w-6 h-5 mt-1 hover:text-purple-600' />
            </button>
          </li>
          <li>
            <span id='logged-in-userName' className='text-purple-600 font-medium text-lg ml-4'>
              {loggedInUserName}
            </span>
          </li>
          <li>
            <button id='logout-button' type='button' onClick={handleLogout}>
              <span className='ml-4 hover:text-purple-700 text-lg'>Logout</span>
            </button>
          </li>
        </ul>
        <button type='button' onClick={() => setExpanded(!expanded)} className='md:hidden ml-4 w-6 h-6 text-purple-700'>
          <MenuIcon />
        </button>
      </nav>
      {isNotificationsListOpen && <NotificationsList />}
    </>
  );
};
