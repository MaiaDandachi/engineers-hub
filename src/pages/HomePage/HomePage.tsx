import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';

import { Header } from '../../components/Header/Header';
import { Posts } from '../../components/Posts/Posts';
import PostModal from '../../components/Posts/PostModal/PostModal';
import Loader from '../../components/Loader';
import { getPosts } from '../../redux-features/posts';

export const HomePage: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { userInfo } = useAppSelector((state) => state.users);
  const posts = useAppSelector((state) => state.posts.posts);
  const isLoading = useAppSelector((state) => state.posts.isLoading);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);

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

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 0) {
      history.push('/register');
    }
  }, [history, userInfo]);

  useEffect(() => {
    fetchPosts.current();
  }, []);

  return (
    <>
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
