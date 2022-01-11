import React, { useState } from 'react';

import { Post } from './Post';
import PostModal from './PostModal';

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
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [clickedPostId, setClickedPostId] = useState('');

  const getPostId = (postId: string) => {
    setClickedPostId(postId);
    setIsEditPostModalOpen(true);
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
          openEditPostModal={(id: string) => getPostId(id)}
        />
      ))}

      {isEditPostModalOpen && (
        <PostModal
          postId={clickedPostId}
          modalTitle='Edit Post'
          modalAction='Edit'
          onClose={() => setIsEditPostModalOpen(false)}
        />
      )}
    </>
  );
};
