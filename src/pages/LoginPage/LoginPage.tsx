import React from 'react';

export const LoginPage: React.FC = () => (
  <div className='bg-gray-100 min-h-screen pt-10 md:pt-20 pb-6 px-2 md:px-0'>
    <header className='max-w-lg mx-auto'>
      <h1 className='text-4xl text-center font-bold text-purple-700'>Engineers Hub</h1>
    </header>
    <div className='bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl'>
      <section>
        <h2 className='font-bold text-2xl'>Welcome to Engineers Hub</h2>
        <h3 className='text-gray-600 pt-2'>login to your account.</h3>
      </section>

      <div className='mt-8'>
        <form className='flex flex-col'>
          <div className='mb-6 pt-3 rounded bg-gray-200'>
            <label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
              Email
            </label>
            <input
              type='email'
              id='email'
              className=' ml-0 bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-700 transition duration-500 px-3'
            />
          </div>
          <div className='mb-6 pt-3 rounded bg-gray-200'>
            <label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2 ml-3'>
              Password
            </label>
            <input
              type='password'
              id='password'
              className=' ml-0 bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 border-gray-300 focus:border-purple-700 transition duration-500 px-3'
            />
          </div>
          <div className='text-gray-600 text-sm pb-3 hover:text-purple-800'>
            <a href='/'>Forgot your password?</a>
          </div>
          <button
            type='submit'
            className='bg-purple-700 hover:bg-purple-800 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200'
          >
            Login
          </button>
        </form>
      </div>
    </div>
    <div className='max-w-lg mx-auto text-center mb-5'>
      <p>
        Don`t have an account?
        <a className='hover:text-purple-800' href='/'>
          {' '}
          Register
        </a>
      </p>
    </div>
  </div>
);
