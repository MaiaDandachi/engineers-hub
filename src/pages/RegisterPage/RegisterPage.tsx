import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { uuid } from 'uuidv4';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';

import { useAppDispatch, useAppSelector } from '../../redux-features/hooks';
import { registerUser } from '../../redux-features/users';

export const RegisterPage: React.FC = () => {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const dispatch = useAppDispatch();
  const history = useHistory();

  const { userInfo } = useAppSelector((state) => state.users);

  const formik = useFormik({
    initialValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(8, 'Must be 8 characters or more').required('Required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match'),
    }),
    onSubmit: async (values) => {
      const resultAction = await dispatch(
        registerUser({
          id: uuid(),
          email: values.email,
          userName: values.userName,
          password: values.password,
        })
      );

      if (registerUser.rejected.match(resultAction)) {
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
    if (userInfo && Object.keys(userInfo).length === 0) {
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
          <h3 className='text-gray-600 pt-2'>Sign Up to your account.</h3>
        </section>

        <div className='mt-8'>
          <form className='flex flex-col' onSubmit={formik.handleSubmit} id='signup-form'>
            <div className='mb-3 pt-3 rounded bg-gray-200'>
              <label htmlFor='userName' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
                UserName
              </label>
              <input
                type='text'
                id='userName'
                name='userName'
                className='auth-card__input'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.userName}
              />
            </div>
            {formik.touched.userName && formik.errors.userName ? (
              <div className='mb-3 text-red-500'>{formik.errors.userName}</div>
            ) : null}
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
              <div className='mb-3 text-red-500' id='emailError'>
                {formik.errors.email}
              </div>
            ) : null}
            <div className='mb-3 pt-3 rounded bg-gray-200 relative'>
              <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
                Password
              </label>
              <input
                type={showPwd ? 'text' : 'password'}
                id='password'
                name='password'
                className='auth-card__input'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              {showPwd ? (
                <EyeIcon
                  className='w-5 h-5 right-3 top-9 text-purple-700 absolute'
                  onClick={() => setShowPwd(!showPwd)}
                />
              ) : (
                <EyeOffIcon
                  id='showPassword'
                  className='w-5 h-5 right-3 top-9  text-purple-700 absolute'
                  onClick={() => setShowPwd(!showPwd)}
                />
              )}
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='mb-3 text-red-500' id='passwordError'>
                {formik.errors.password}
              </div>
            ) : null}
            <div className='mb-3 pt-3 rounded bg-gray-200 relative'>
              <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
                Confirm Password
              </label>
              <input
                type={showConfirmPwd ? 'text' : 'password'}
                id='confirmPassword'
                name='confirmPassword'
                className='auth-card__input'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
              {showConfirmPwd ? (
                <EyeIcon
                  className='w-5 h-5 right-3 top-9 text-purple-700 absolute'
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                />
              ) : (
                <EyeOffIcon
                  className='w-5 h-5 right-3 top-9 text-purple-700 absolute'
                  onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                />
              )}
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className='mb-3 text-red-500'>{formik.errors.confirmPassword}</div>
            ) : null}
            <button type='submit' className='auth-card__submit'>
              Sign Up
            </button>
          </form>
        </div>
      </div>
      <div className='max-w-lg mx-auto text-center mb-5'>
        <p>
          Already a member?{' '}
          <Link to='/login' className='hover:text-purple-800'>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};
