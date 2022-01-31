import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { io } from 'socket.io-client';

import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';

import { Header } from '../../components/Header/Header';
import { Posts } from '../../components/Posts/Posts';
import PostModal from '../../components/Posts/PostModal/PostModal';
import Loader from '../../components/Loader';
import { getPosts } from '../../redux-features/posts';
import { setSocket } from '../../redux-features/globals';
import SocketClient from '../../SocketClient';

export const HomePage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((state) => state.users);
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  // const [currentSocket, setCurrentSocket] = useState<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchPosts = useRef(() => {});

  fetchPosts.current = async () => {
    const resultAction = await dispatch(getPosts());
    if (getPosts.rejected.match(resultAction)) {
      if (resultAction.payload) {
        // if the error is sent from server payload
        toast.error(
          <div>
            Error
            <br />
            {resultAction.payload.errorMessage}
          </div>,

          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      } else {
        toast.error(
          <div>
            Error
            <br />
            {resultAction.error}
          </div>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  // const initSocket = useRef(() => {});
  // initSocket.current = () => {
  //   const socket = io('http://localhost:5000');
  //   dispatch(setSocket(socket));
  // };

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 0) {
      history.push('/register');
    }
  }, [history, userInfo]);

  useEffect(() => {
    fetchPosts.current();
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:5000');
    dispatch(setSocket(socket));
    return () => {
      socket.close();
    };
  }, [dispatch]);

  return (
    <>
      <SocketClient />
      <Header loggedInUserName={userInfo?.userName} />
      <ToastContainer />
      <div className='bg-red-0 flex justify-end'>
        <button
          type='button'
          className='bg-purple-600 m-4 px-4 py-2 text-gray-100 rounded shadow'
          onClick={() => setIsCreatePostModalOpen(true)}
        >
          Create Post
        </button>
      </div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className='w-full flex flex-col items-center'>
          <Posts posts={posts} />
        </div>
      )}
      {isCreatePostModalOpen && (
        <PostModal modalTitle='Add Post' modalAction='Create' onClose={() => setIsCreatePostModalOpen(false)} />
      )}
    </>
  );
};
