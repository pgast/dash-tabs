import React, { Component } from 'react';

import { withFirebase } from '../Firebase';
import PasswordChangeView from './passwordChangeView';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;
    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <PasswordChangeView 
        error={error}
        isInvalid={isInvalid}
        onSubmit={this.onSubmit}
        onChange={this.onChange}
        passwordOne={passwordOne}
        passwordTwo={passwordTwo}
      />
    );
  }
}

export default withFirebase(PasswordChangeForm);
