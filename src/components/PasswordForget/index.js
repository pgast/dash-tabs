import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './style.css';

const PasswordForgetPage = () => (
  <div className="passwordForget">
     <div className="dashboardHeader">
        <h1>RESET PASSWORD</h1>
    </div>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: '',
  error: null,
};

class PasswordForgetFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email } = this.state;

    this.props.firebase
      .doPasswordReset(email)
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
    const { email, error } = this.state;

    const isInvalid = email === '';

    return (
      <div>
        <form onSubmit={this.onSubmit}>
          <input
            type="text"
            name="email"
            value={this.state.email}
            onChange={this.onChange}
            placeholder="Email Address"
          />
          <button disabled={isInvalid} type="submit">
            Reset My Password
          </button>
          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

const PasswordForgetLink = () => (
  <div>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </div>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
