import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../redux-features/hooks';
import { Header } from '../../components/Header';

export const HomePage: React.FC = () => {
  const { userInfo } = useAppSelector((state) => state.users);

  const history = useHistory();

  useEffect(() => {
    if (!userInfo) {
      history.push('/register');
    }
  }, [history, userInfo]);

  return (
    <>
      <Header loggedInUserName={userInfo?.userName} />
      <div>home</div>
    </>
  );
};
