import React, { useState } from 'react';
import { PencilAltIcon, TrashIcon } from '@heroicons/react/outline';
import { useAppSelector } from '../redux-features/hooks';
import Modal from './Modal';

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
            {/* <p className='text-gray-700'>{publishedDate}</p> */}

            {userInfo.id === postUserInfo.id && (
              <>
                <TrashIcon className='w-5 h-5 right-3 bottom-4 absolute hover:text-red-600' />
                <PencilAltIcon
                  className='w-5 h-5 right-10 bottom-4 absolute hover:text-purple-600'
                  onClick={() => setIsEditPostModalOpen(true)}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {isEditPostModalOpen && (
        <Modal postId={id} modalTitle='Edit Post' modalAction='Edit' onClose={() => setIsEditPostModalOpen(false)} />
      )}
    </>
  );
};
