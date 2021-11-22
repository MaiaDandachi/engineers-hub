import React from 'react';

import { Post } from './Post';

interface IPosts {
  posts: Array<{
    title: string;
    content: string;
    author: string;
    publishedDate: string;
  }>;
}
export const Posts: React.FC<IPosts> = ({ posts }) => (
  <div>
    {posts.map((post, index) => (
      <Post key={index.toString()} post={post} />
    ))}
  </div>
);
