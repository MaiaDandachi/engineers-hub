import React, { useState } from 'react';

import { Post } from './Post';
import Modal from './Modal';

interface IPosts {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    postUserInfo: {
      id: string;
      userName: string;
    };
  }>;
}
export const Posts: React.FC<IPosts> = ({ posts }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [clickedPostId, setClickedPostId] = useState('');

  const getPostId = (postId: string) => {
    setClickedPostId(postId);
    setIsEditModalOpen(true);
  };

  return (
    <>
      {posts.map((item, idx) => (
        <Post
          id={item.id}
          key={idx.toString()}
          title={item.title}
          content={item.content}
          postUserInfo={item.postUserInfo}
          openEditModal={(id: string) => getPostId(id)}
        />
      ))}

      {isEditModalOpen && (
        <Modal
          postId={clickedPostId}
          modalTitle='Edit Post'
          modalAction='Edit'
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </>
  );
};
