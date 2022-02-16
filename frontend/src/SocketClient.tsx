import React, { useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';
import { useAppSelector } from './redux-features/hooks';

interface ISocketClient {
  socket: Socket<DefaultEventsMap> | null;
}

export const SocketClient: React.FC<ISocketClient> = ({ socket }) => {
  const user = useAppSelector((state) => state.users.userInfo);

  useEffect(() => {
    if (socket?.id && user?.id) {
      socket.emit('joinUser', user.id);
    }
  }, [socket, user.id]);

  return <></>;
};

export default SocketClient;
