import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { PencilAltIcon, TrashIcon, AnnotationIcon, HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { useAppDispatch, useAppSelector } from '../redux-features/hooks';

import { deletePost } from '../redux-features/posts';

interface IPost {
  id: string;
  title: string;
  content: string;
  // eslint-disable-next-line react/require-default-props
  commentsCount?: number;
  postUserInfo: {
    id: string;
    userName: string;
  };
  openEditPostModal: (id: string) => void;
  openCommentModal: (id: string, postTitle: string) => void;
}

export const Post: React.FC<IPost> = ({
  title,
  content,
  id,
  postUserInfo,
  commentsCount,
  openEditPostModal,
  openCommentModal,
}) => {
  const { userInfo } = useAppSelector((state) => state.users);
  const dispatch = useAppDispatch();

  const [isPostLiked, setIsPostLiked] = useState(false);

  const handlePostLike = () => {
    setIsPostLiked(!isPostLiked);
  };

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
          <p className='px-5 py-2 text-purple-600 font-medium'>{postUserInfo.userName},</p>

          <div className='text-sm px-5 pt-1 pb-5 flex'>
            <div className='flex'>
              <button type='button' className='hover:text-purple-600' onClick={handlePostLike}>
                {isPostLiked ? (
                  <HeartIconSolid className='w-5 h-5 left-5 bottom-4 text-purple-700' />
                ) : (
                  <HeartIcon className='w-5 h-5 left-5 bottom-4 ' />
                )}
              </button>
              <span className='pl-1'>3 likes</span>
            </div>

            <div className='flex pl-2'>
              <button type='button'>
                <AnnotationIcon
                  className='w-5 h-5 left-12 bottom-4  hover:text-purple-600'
                  onClick={() => openCommentModal(id, title)}
                />
              </button>
              <span className='pl-1'>{commentsCount || 0} comments</span>
            </div>

            {userInfo.id === postUserInfo.id && (
              <>
                <TrashIcon
                  className='w-5 h-5 right-3 bottom-4 absolute hover:text-red-600'
                  onClick={handlePostDelete}
                />
                <PencilAltIcon
                  className='w-5 h-5 right-10 bottom-4 absolute hover:text-purple-600'
                  onClick={() => openEditPostModal(id)}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
