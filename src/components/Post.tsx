import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { useAppDispatch, useAppSelector } from '../redux-features/hooks';

import Modal from './Modal';
import { deletePost } from '../redux-features/posts';

interface IPost {
  id: string;
  title: string;
  content: string;
  postUserInfo: {
    id: string;
    userName: string;
  };
}

export const Post: React.FC<IPost> = ({ title, content, id, postUserInfo }) => {
  const { userInfo } = useAppSelector((state) => state.users);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const dispatch = useAppDispatch();

  const handlePostDelete = async () => {
    const resultAction = await dispatch(deletePost(id));
    if (deletePost.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          Success
          <br />
          {resultAction.payload.message}
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );
    }

    if (deletePost.rejected.match(resultAction)) {
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

  return (
    <>
      <div className='post-card'>
        <div className='flex flex-col justify-between h-full'>
          <div className='p-5'>
            <div className='text-gray-900 font-bold text-xl mb-2'>{title}</div>
            <p className='text-gray-700 text-base break-all '>{content}</p>
          </div>

          <div className='text-sm p-5'>
            <p className='text-purple-600 font-medium'>{postUserInfo.userName},</p>

            {userInfo.id === postUserInfo.id && (
              <>
                <TrashIcon
                  className='w-5 h-5 right-3 bottom-4 absolute hover:text-red-600'
                  onClick={handlePostDelete}
                />
                <PencilAltIcon
                  className='w-5 h-5 right-10 bottom-4 absolute hover:text-purple-600'
                  onClick={() => setIsEditPostModalOpen(true)}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
      {isEditPostModalOpen && (
        <Modal postId={id} modalTitle='Edit Post' modalAction='Edit' onClose={() => setIsEditPostModalOpen(false)} />
      )}
    </>
  );
};
