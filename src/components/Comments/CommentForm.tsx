import React from 'react';

export const CommentForm: React.FC = () => (
  <>
    <div id='modal-body' className='bg-gray-50 p-4 my-2'>
      <div className='mb-3 pt-3 rounded bg-gray-200'>
        <label className='block text-gray-700 text-sm font-bold mb-2 ml-3' htmlFor='post-title'>
          Add a comment
        </label>
        <input
          id='post-title'
          type='text'
          className='auth-card__input'
          //   value={state.title}
          //   onChange={(e) => handleInputChange(e, 'title')
        />
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
