import React from 'react';
import { CommentForm } from './CommentForm';
import { Comments } from './Comments';

interface ICommentModalProps {
  // eslint-disable-next-line react/require-default-props
  postId: string;
  title: string;
  onClose: () => void;
}

export const CommentModal: React.FC<ICommentModalProps> = ({ postId, title, onClose }) => (
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

      <CommentForm />
      <Comments postId={postId} />
    </div>
  </div>
);

export default CommentModal;
