import { Socket } from 'socket.io';

interface IuserSocketObj {
  userId: string;
  socketId: string;
}
let users: Array<IuserSocketObj> = [];

const addNewNuser = (id: string, socketId: string) =>
  !users.some((user) => user.userId === id) && users.push({ userId: id, socketId });

const getUser = (userId: string) => users.find((user) => user.userId === userId);

const removeUser = (socketId: string) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const SocketServer = (socket: Socket) => {
  // Connect - Disconnect
  socket.on('joinUser', (id) => {
    addNewNuser(id, socket.id);

    console.log(`${socket.id} connected`);
    console.log('Users', users);
  });

  socket.on('sendNotification', ({ senderId, receiverId, senderMail, postTopic, type }) => {
    const receiver = getUser(receiverId);
    console.log(`Got an notfictaion. ${senderId} liked ${receiverId} post `);
    socket.to(receiver?.socketId || '').emit('getNotification', {
      senderId,
      senderMail,
      postTopic,
      type,
    });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);

    console.log(`${socket.id} diconnected`);
  });
};

export default SocketServer;
