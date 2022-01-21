import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import { toast } from 'react-toastify';

import { CommentForm } from './CommentForm';
import { Comments } from './Comments';

import { createComment } from '../../redux-features/comments';
import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';

interface ICommentModalProps {
  // eslint-disable-next-line react/require-default-props
  postId: string;
  title: string;
  onClose: () => void;
}

export const CommentModal: React.FC<ICommentModalProps> = ({ postId, title, onClose }) => {
  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((state) => state.users.userInfo);

  const handleCommentAdd = async (comment: string) => {
    const { id: userId } = userInfo;
    const resultAction = await dispatch(
      createComment({
        id: uuidV4(),
        postId,
        userId: userId || '',
        text: comment,
        creationDate: new Date().toLocaleString(),
      })
    );

    if (createComment.fulfilled.match(resultAction)) {
      toast.success(
        <div>
          Success
          <br />
          Comment created
        </div>,
        {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
      );

      onClose();
    }

    if (createComment.rejected.match(resultAction)) {
      if (resultAction.payload) {
        // if the error is sent from server payload
        toast.error(
          <div>
            Error
            <br />
            {resultAction.payload.errorMessage}
          </div>,

          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      } else {
        toast.error(
          <div>
            Error
            <br />
            {resultAction.error}
          </div>,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      }
    }
  };

  return (
    <>
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

          <CommentForm onCommentAdd={(comment) => handleCommentAdd(comment)} />
          <Comments postId={postId} />
        </div>
      </div>
    </>
  );
};

export default CommentModal;
