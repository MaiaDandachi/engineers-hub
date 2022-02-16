import React, { useEffect, useState, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

import { getUserLikedPosts } from '../../redux-features/users';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';

import { Post } from './Post';
import PostModal from './PostModal/PostModal';
import CommentModal from '../Comments/CommentModal';

interface IPosts {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    postUserInfo: {
      id: string;
      userName: string;
    };
    commentsCount: number;
    likesCount: number;
  }>;
  socket: Socket<DefaultEventsMap> | null;
}
export const Posts: React.FC<IPosts> = ({ posts, socket }) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.users.userInfo);

  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const [clickedPostId, setClickedPostId] = useState('');
  const [clickedPostTitle, setClickedPostTitle] = useState('');
  const [clickedPostContent, setClickedPostContent] = useState('');

  const isPostLikedByUser = (postId: string) => {
    if (userInfo.likedPosts) {
      return userInfo.likedPosts.some((id) => id === postId);
    }
    return false;
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchUserLikedPosts = useRef(() => {});

  fetchUserLikedPosts.current = async () => {
    await dispatch(getUserLikedPosts(userInfo.id || ''));
  };

  useEffect(() => {
    fetchUserLikedPosts.current();
  }, []);

  const openPostEditModal = (postId: string, postTitle: string, postContent: string) => {
    setClickedPostId(postId);
    setClickedPostTitle(postTitle);
    setClickedPostContent(postContent);
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
          commentsCount={item.commentsCount}
          likesCount={item.likesCount}
          openEditPostModal={(id: string, postTitle: string, postContent: string) => {
            openPostEditModal(id, postTitle, postContent);
          }}
          openCommentModal={(id: string, postTitle: string) => {
            openCommentModal(id, postTitle);
          }}
          isPostLikedByUser={() => isPostLikedByUser(item.id)}
          socket={socket}
        />
      ))}

      {isEditPostModalOpen && (
        <PostModal
          postId={clickedPostId}
          modalTitle='Edit Post'
          modalAction='Edit'
          postTitle={clickedPostTitle}
          postContent={clickedPostContent}
          onClose={() => {
            setIsEditPostModalOpen(false);
            setClickedPostId('');
          }}
        />
      )}

      {isCommentModalOpen && clickedPostId && (
        <CommentModal
          postId={clickedPostId}
          title={clickedPostTitle}
          onClose={() => {
            setIsCommentModalOpen(false);
            setClickedPostId('');
          }}
        />
      )}
    </>
  );
};
