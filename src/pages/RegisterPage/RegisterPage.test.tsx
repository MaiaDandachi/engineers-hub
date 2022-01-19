import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount, shallow, ReactWrapper } from 'enzyme';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

import { RegisterPage } from './RegisterPage';
import { store } from '../../store';

const updateFormikField = async (
  // eslint-disable-next-line
  nativeFieldWrapper: ReactWrapper<any, any, React.Component<{}, {}, any>>,
  targetName: string,
  value: string
) => {
  // updates values and errors
  await act(async () => {
    nativeFieldWrapper.simulate('change', {
      target: { name: targetName, value },
    });
  });
  // updates touched
  await act(async () => {
    nativeFieldWrapper.simulate('blur', { target: { name: targetName } });
  });
};

describe('RegisterPage', () => {
  let wrapper: ReactWrapper;

  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Provider store={store}>
          <RegisterPage />
        </Provider>
      </Router>
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

  it('submits the form', () => {
    const onSubmitForm = jest.fn();
    const form = shallow(wrapper.find('#signup-form').get(0));

    form.setProps({ onSubmit: onSubmitForm });

    form.simulate('submit');
    expect(onSubmitForm).toHaveBeenCalledTimes(1);
  });

  describe('Email input', () => {
    let emailInput: ReactWrapper;

    beforeEach(() => {
      emailInput = wrapper.find('#email');
    });

    it('should show empty email error on empty value', async () => {
      await updateFormikField(emailInput, 'email', '');

      wrapper.update();

      const emailError = wrapper.find('#emailError');
      expect(emailError.props().children).toEqual('Required');
    });

    it('should show invalid emaial error on typing invalid email', async () => {
      await updateFormikField(emailInput, 'email', 'maia@');

      wrapper.update();

      const emailError = wrapper.find('#emailError');
      expect(emailError.props().children).toEqual('Invalid email address');
    });
  });

  describe('Password input', () => {
    let passwordInput: ReactWrapper;

    beforeEach(() => {
      passwordInput = wrapper.find('#password');
    });

    it('should show empty password error on empty value', async () => {
      await updateFormikField(passwordInput, 'password', '');

      wrapper.update();

      const passwordError = wrapper.find('#passwordError');
      expect(passwordError.props().children).toEqual('Required');
    });

    it('should show invalid password error on invalid short password less than 8 char', async () => {
      await updateFormikField(passwordInput, 'password', '12345');

      wrapper.update();

      const passwordError = wrapper.find('#passwordError');
      expect(passwordError.props().children).toEqual('Must be 8 characters or more');
    });
  });

  describe('the user clicks on the show password icon', () => {
    it('should show the text password', async () => {
      const showPasswordIcon = wrapper.find('#showPassword').at(1);
      console.log(wrapper.debug());
      await act(async () => {
        showPasswordIcon.simulate('click');
      });
      wrapper.update();
      const passwordInput = wrapper.find('#password');

      expect(passwordInput.props().type).toEqual('text');
    });
  });
});
