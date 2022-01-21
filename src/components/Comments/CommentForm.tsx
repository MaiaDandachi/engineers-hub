import React, { useState } from 'react';
import { ResizableTextArea } from '../common/ResizableTextArea';

export const CommentForm: React.FC = () => {
  const [comment, setComment] = useState('');

  return (
    <>
      <div id='modal-body' className='bg-gray-50 p-4 my-2'>
        <div className='mb-3 pt-3 rounded bg-gray-200'>
          <label className='block text-gray-700 text-sm font-bold mb-2 ml-3' htmlFor='comment-text'>
            Add a comment
          </label>
          <ResizableTextArea id='comment-text' value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>
        <button
          type='button'
          className='block mx-auto w-2/6 mb-1 px-3 py-1 rounded text-white bg-purple-600 hover:bg-purple-800'
        >
          Add
        </button>
      </div>
    </>
  );
};
