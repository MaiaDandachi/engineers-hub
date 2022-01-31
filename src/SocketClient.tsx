import React, { useEffect } from 'react';
import { useAppSelector } from './redux-features/hooks';

export const SocketClient: React.FC = () => {
  const socket = useAppSelector((state) => state.globals.socket);
  const user = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (socket?.id && user?.id) {
      socket.emit('joinUser', user.id);
    }
  }, [socket, user.id]);

  useEffect(() => {
    socket.on('getNotification', (data: { senderId: string; type: number }) => {
      console.log(`${data.senderId} liked your post`);
    });
  }, [socket]);

  return <></>;
};

export default SocketClient;
