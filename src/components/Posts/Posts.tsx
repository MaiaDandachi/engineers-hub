import React, { useState } from 'react';

import { Post } from './Post';
import PostModal from './PostModal/PostModal';
import CommentModal from '../Comments/CommentModal';

interface IPosts {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    commentsCount?: number;
    postUserInfo: {
      id: string;
      userName: string;
    };
  }>;
}
export const Posts: React.FC<IPosts> = ({ posts }) => {
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [clickedPostId, setClickedPostId] = useState('');
  const [clickedPostTitle, setClickedPostTitle] = useState('');

  const openPostEditModal = (postId: string) => {
    setClickedPostId(postId);
    setIsEditPostModalOpen(true);
  };

  const openCommentModal = (postId: string, postTitle: string) => {
    setClickedPostId(postId);
    setClickedPostTitle(postTitle);
    setIsCommentModalOpen(true);
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
          commentsCount={item.commentsCount ? item.commentsCount : 0}
          openEditPostModal={(id: string) => openPostEditModal(id)}
          openCommentModal={(id: string, postTitle: string) => openCommentModal(id, postTitle)}
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

      {isCommentModalOpen && (
        <CommentModal postId={clickedPostId} title={clickedPostTitle} onClose={() => setIsCommentModalOpen(false)} />
      )}
    </>
  );
};
