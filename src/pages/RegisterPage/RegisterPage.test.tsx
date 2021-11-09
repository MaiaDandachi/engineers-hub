import React from 'react';
import { mount, shallow, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';

import { RegisterPage } from './RegisterPage';
import { store } from '../../store';

describe('RegisterPage', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <RegisterPage />
      </Provider>
    );
  });

  it('renders a form', () => {
    expect(wrapper.find('#signup-form')).toHaveLength(1);
  });

  it('renders 4 form input fields', () => {
    const form = wrapper.find('#signup-form');

    expect(form.find('input')).toHaveLength(4);
  });

  it('renders a submit button', () => {
    const form = wrapper.find('#signup-form');
    expect(form.find('button')).toHaveLength(1);
  });
});
