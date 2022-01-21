import React, { useState } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../../redux-features/hooks';
import { createPost, editPost } from '../../../redux-features/posts';
import { ResizableTextArea } from '../../common/ResizableTextArea';

interface IPostModalProps {
  // eslint-disable-next-line react/require-default-props
  postId?: string;
  modalTitle: string;
  modalAction: string;
  onClose: () => void;
}

const PostModal: React.FC<IPostModalProps> = ({ postId = '', modalTitle, modalAction, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const dispatch = useAppDispatch();
  const userInfo = useAppSelector((reduxState) => reduxState.users.userInfo);

  const handlePostCreate = async () => {
    const { id, userName } = userInfo;
    if (userInfo) {
      const resultAction = await dispatch(
        createPost({
          id: uuidV4(),
          postUserInfo: { id: id || '', userName: userName || '' },
          title,
          content,
        })
      );

      if (createPost.rejected.match(resultAction)) {
        if (resultAction.payload) {
          toast.error(
            <div>
              Error
              <br />
              {resultAction.payload.errorMessage}
            </div>,

            {
              position: toast.POSITION.TOP_RIGHT,
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
              position: toast.POSITION.TOP_RIGHT,
            }
          );
        }
      } else {
        onClose();
      }
    }
  };

  const handlePostEdit = async () => {
    const { id, userName } = userInfo;
    const resultAction = await dispatch(
      editPost({
        postUserInfo: { id: id || '', userName: userName || '' },
        title,
        content,
        id: postId || '',
      })
    );

    if (editPost.rejected.match(resultAction)) {
      if (resultAction.payload) {
        toast.error(
          <div>
            Error
            <br />
            {resultAction.payload.errorMessage}
          </div>,

          {
            position: toast.POSITION.TOP_RIGHT,
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
            position: toast.POSITION.TOP_RIGHT,
          }
        );
      }
    } else {
      onClose();
    }
  };

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
      <ToastContainer />
      <div
        className='w-3/4 xs:w-2/6 bg-white p-3 cursor-default'
        role='button'
        onKeyDown={(e) => {
          //   console.log(e);
        }}
        onClick={(e) => e.stopPropagation()}
        tabIndex={0}
      >
        <h4 id='modal-title' className='text-lg font-bold'>
          {modalTitle}
        </h4>
        <div id='modal-body' className='bg-gray-50 p-4 my-2'>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label className='block text-gray-700 text-sm font-bold mb-2 ml-3' htmlFor='post-title'>
              Title
            </label>
            <input
              id='post-title'
              type='text'
              className='auth-card__input'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className='mb-3 pt-3 rounded bg-gray-200'>
            <label className='block text-gray-700 text-sm font-bold mb-2 ml-3' htmlFor='post-content'>
              Content
            </label>
            <ResizableTextArea id='post-content' value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
        </div>
        <div id='modal-footer' className='flex justify-end'>
          <button type='button' className='px-3 py-1' onClick={() => onClose()}>
            Cancel
          </button>
          <button
            id='modal-action'
            type='button'
            className='px-3 py-1 rounded text-white bg-purple-600 hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={modalAction === 'Create' ? handlePostCreate : handlePostEdit}
            disabled={!title || !content}
          >
            {modalAction}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
