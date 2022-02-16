import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { loginUser } from '../../redux-features/users';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const { userInfo } = useAppSelector((state) => state.users);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        loginUser({
          email: values.email,
          password: values.password,
        })
      );

      if (loginUser.rejected.match(resultAction)) {
        if (resultAction.payload) {
          // if the error is sent from server payload
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
      }
    },
  });

  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length !== 0) {
      history.push('/');
    }
  }, [history, userInfo]);

  return (
    <div className='auth-container'>
      <ToastContainer />
      <header className='max-w-lg mx-auto'>
        <h1 className='text-4xl text-center font-bold text-purple-700'>Engineers Hub</h1>
      </header>
      <div className='auth-card'>
        <section>
          <h2 className='font-bold text-2xl'>Welcome to Engineers Hub</h2>
          <h3 className='text-gray-600 pt-2'>Sign In to your account.</h3>
        </section>

        <div className='mt-8'>
          <form className='flex flex-col' onSubmit={formik.handleSubmit}>
            <div className='mb-3 pt-3 rounded bg-gray-200'>
              <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
                Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                className='auth-card__input'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className='mb-3 text-red-500'>{formik.errors.email}</div>
            ) : null}
            <div className='mb-3 pt-3 rounded bg-gray-200'>
              <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
                Password
              </label>
              <input
                type='password'
                id='password'
                name='password'
                className='auth-card__input'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='mb-3 text-red-500'>{formik.errors.password}</div>
            ) : null}
            <div className='text-gray-600 text-sm pb-3 hover:text-purple-800'>
              <a href='/'>Forgot your password?</a>
            </div>
            <button type='submit' className='auth-card__submit'>
              Sign In
            </button>
          </form>
        </div>
      </div>
      <div className='max-w-lg mx-auto text-center mb-5'>
        <p>
          Don&apos;t have an account?
          <Link to='/register' className='hover:text-purple-800'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
