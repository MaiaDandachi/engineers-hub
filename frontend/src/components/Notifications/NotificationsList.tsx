import React from 'react';

interface INotificationsListProps {
  notifications: Array<string>;
}

export const NotificationsList: React.FC<INotificationsListProps> = ({ notifications }) => (
  <div className='absolute z-10 bg-gray-200 rounded-md top-10 p-3 right-36 shadow-lg'>
    <h1 className='text-xl font-bold '>Notifications</h1>
    {notifications.map((notification, idx) => (
      <div key={idx.toString()}>{notification}</div>
    ))}
  </div>
);
