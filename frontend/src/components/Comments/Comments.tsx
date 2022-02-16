import React, { useEffect, useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import { useAppSelector, useAppDispatch } from '../../redux-features/hooks';
import { getPostComments } from '../../redux-features/comments';

interface CommentsProps {
  postId: string;
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const dispatch = useAppDispatch();

  const { comments, isLoading } = useAppSelector((state) => state.comments);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fetchPostComments = useRef(() => {});

  fetchPostComments.current = async () => {
    const resultAction = await dispatch(getPostComments(postId));
    if (getPostComments.rejected.match(resultAction)) {
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

  useEffect(() => {
    fetchPostComments.current();
  }, []);

  const skeleton = (
    <div className='flex animate-pulse flex-row items-center h-full justify-center space-x-5'>
      <div className='flex flex-col space-y-3'>
        <div className='w-36 bg-gray-300 h-6 rounded-md ' />
        <div className='w-24 bg-gray-300 h-6 rounded-md ' />
      </div>
    </div>
  );

  const commentsList = comments.map((comment, idx) => (
    <div key={idx.toString()} className='flex flex-col h-auto'>
      <span className='text-purple-600 font-bold'>@{comment.userInfo?.userName}</span>
      <span className='text-gray-500 '>{comment.creationDate.substring(0, 9)}</span>
      <span>{comment.text}</span>
      <div className='flex-grow border-t my-3 opacity-25 border-purple-800' />
    </div>
  ));

  return (
    <>
      {isLoading ? skeleton : commentsList}
      <ToastContainer />
    </>
  );
};
