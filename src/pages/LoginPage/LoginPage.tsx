import React from 'react';

export const LoginPage: React.FC = () => (
  <div className='login-container'>
    <header className='max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-bold text-purple-700'>Engineers Hub</h1>
    </header>
    <div className='login-card'>
      <section>
        <h2 className='font-bold text-2xl'>Welcome to Engineers Hub</h2>
        <h3 className='text-gray-600 pt-2'>Sign In to your account.</h3>
      </section>

      <div className='mt-8'>
        <form className='flex flex-col'>
          <div className='mb-6 pt-3 rounded bg-gray-200'>
            <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
              Email
            </label>
            <input type='email' id='email' className='login-card__input' />
          </div>
          <div className='mb-6 pt-3 rounded bg-gray-200'>
            <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
              Password
            </label>
            <input type='password' id='password' className='login-card__input' />
          </div>
          <div className='text-gray-600 text-sm pb-3 hover:text-purple-800'>
            <a href='/'>Forgot your password?</a>
          </div>
          <button type='submit' className='login-card__submit'>
            Sign In
          </button>
        </form>
      </div>
    </div>
    <div className='max-w-lg mx-auto text-center mb-5'>
      <p>
        Don&apos;t have an account?
        <a className='hover:text-purple-800' href='/'>
          {' '}
          Sign Up
        </a>
      </p>
    </div>
  </div>
);
