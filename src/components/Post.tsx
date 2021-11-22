import React from 'react';

interface IPost {
  post: { title: string; content: string; author: string; publishedDate: string };
}

export const Post: React.FC<IPost> = ({ post }) => (
  <div className='post-card'>
    <div className='flex flex-col justify-between h-full'>
      <div className='p-5'>
        <div className='text-gray-900 font-bold text-xl mb-2'>{post.title}</div>
        <p className='text-gray-700 text-base break-all '>{post.content}</p>
      </div>

      <div className='text-sm p-5'>
        <p className='text-purple-600 font-medium'>{post.author},</p>
        <p className='text-gray-700'>{post.publishedDate}</p>
      </div>
    </div>
  </div>
);
