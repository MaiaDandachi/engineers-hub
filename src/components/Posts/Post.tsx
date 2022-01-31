import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { PencilAltIcon, TrashIcon, AnnotationIcon, HeartIcon } from '@heroicons/react/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/solid';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';

import { deletePost, likePost, unlikePost } from '../../redux-features/posts';

interface IPost {
  id: string;
  title: string;
  content: string;
  postUserInfo: {
    id: string;
    userName: string;
  };
  commentsCount: number;
  likesCount: number;
  openEditPostModal: (id: string, postTitle: string, postContent: string) => void;
  openCommentModal: (id: string, postTitle: string) => void;
  isPostLikedByUser: () => boolean;
}

export const Post: React.FC<IPost> = ({
  title,
  content,
  id,
  postUserInfo,
  commentsCount,
  likesCount,
  openEditPostModal,
  openCommentModal,
  isPostLikedByUser,
}) => {
  const isPostLikedByCurrentUser = isPostLikedByUser();
  const { userInfo } = useAppSelector((state) => state.users);
  const socket = useAppSelector((state) => state.globals.socket);
  const dispatch = useAppDispatch();

  const [numberOfLikes, setNumberOfLikes] = useState(likesCount);
  const [isPostLiked, setIsPostLiked] = useState(isPostLikedByCurrentUser);

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

  const handlePostLikeUnlike = async () => {
    if (!isPostLiked) {
      await dispatch(likePost({ postId: id, userId: userInfo.id || '' }));
      socket.emit('sendNotification', {
        senderId: userInfo.id,
        receiverId: postUserInfo.id,
        type: 1,
      });
    } else {
      await dispatch(unlikePost({ postId: id, userId: userInfo.id || '' }));
    }
    setNumberOfLikes(isPostLiked ? numberOfLikes - 1 : numberOfLikes + 1);
    setIsPostLiked(!isPostLiked);
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
              <button type='button' className='hover:text-purple-600' onClick={handlePostLikeUnlike}>
                {isPostLiked ? (
                  <HeartIconSolid className='w-5 h-5 left-5 bottom-4 text-purple-700' />
                ) : (
                  <HeartIcon className='w-5 h-5 left-5 bottom-4 ' />
                )}
              </button>
              <span className='pl-1'>{numberOfLikes} likes</span>
            </div>

            <div className='flex pl-2'>
              <button type='button'>
                <AnnotationIcon
                  className='w-5 h-5 left-12 bottom-4  hover:text-purple-600'
                  onClick={() => openCommentModal(id, title)}
                />
              </button>
              <span className='pl-1'>{commentsCount} comments</span>
            </div>

            {userInfo.id === postUserInfo.id && (
              <>
                <TrashIcon
                  className='w-5 h-5 right-3 bottom-4 absolute hover:text-red-600'
                  onClick={handlePostDelete}
                />
                <PencilAltIcon
                  className='w-5 h-5 right-10 bottom-4 absolute hover:text-purple-600'
                  onClick={() => openEditPostModal(id, title, content)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
