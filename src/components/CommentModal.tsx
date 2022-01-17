import React, { useEffect } from 'react';
import { getPostComments } from '../redux-features/comments';
import { useAppSelector, useAppDispatch } from '../redux-features/hooks';

interface ICommentModalProps {
  // eslint-disable-next-line react/require-default-props
  postId: string;
  title: string;
  onClose: () => void;
}

export const CommentModal: React.FC<ICommentModalProps> = ({ postId, title, onClose }) => {
  const dispatch = useAppDispatch();

  const comments = useAppSelector((state) => state.comments.comments);

  useEffect(() => {
    dispatch(getPostComments(postId));
  }, [dispatch, postId]);

  return (
    <div
      onClick={() => onClose()}
      role='button'
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
      className='bg-black bg-opacity-40 fixed inset-0 flex justify-center items-center'
      tabIndex={0}
    >
      <div
        className='w-3/4 xs:w-2/6 bg-white p-3 cursor-default'
        role='button'
        onKeyDown={(e) => {
          //   console.log(e);
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <div className='flex justify-between'>
          <h4 id='modal-title' className='text-lg font-bold'>
            {title}
          </h4>
          <button type='button' className='px-3 py-1' onClick={() => onClose()}>
            Cancel
          </button>
        </div>

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

        {comments.map((comment, idx) => (
          <>
            <div key={idx.toString()} className='flex flex-col h-auto'>
              <span className='text-purple-600 font-bold'>@{comment.commentUserInfo.userName}</span>
              <span className='text-gray-500 '>{new Date().toLocaleString().substring(0, 9)}</span>
              <span>{comment.text}</span>
              <div className='flex-grow border-t my-3 opacity-25 border-purple-800' />
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default CommentModal;
