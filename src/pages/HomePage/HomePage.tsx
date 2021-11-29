import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../redux-features/hooks';
import { Header } from '../../components/Header';
import { Posts } from '../../components/Posts';

export const HomePage: React.FC = () => {
  const { userInfo } = useAppSelector((state) => state.users);

  const dummyPosts = [
    { title: 'hehehehehe', content: 'hhhsbaisbdas', author: 'maia', publishedDate: '22/11/2021' },
    {
      title: 'HAHAHAHA',
      content: 'hhhsbaisbdahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhs',
      author: 'maia',
      publishedDate: '22/11/2021',
    },
    {
      title: 'Coffee?',
      content: 'hhhsbaisbdahhhhhhhhhhhhhhhhh hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhs',
      author: 'maia',
      publishedDate: '22/11/2021',
    },
  ];

  const history = useHistory();

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 0) {
      history.push('/register');
    }
  }, [history, userInfo]);

  return (
    <>
      <Header loggedInUserName={userInfo?.userName} />
      <div>Home</div>
      <div className='p-5 w-full flex justify-center'>
        <Posts posts={dummyPosts} />
      </div>
    </>
  );
};
