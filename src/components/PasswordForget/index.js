import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.css';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const PasswordForgetPage = () => (
  <div className="passwordForget">
    <div id="backBtn">
      <Link to={ROUTES.HOME} style={{ color: 'black' }}>
        <FontAwesomeIcon icon={faCaretLeft} size="2x" />
      </Link>
    </div>
    <div className="mobileHeader">
      <h3>RESET PW</h3>
    </div>
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
        <div>
          Type your registered e-mail to get a new password
        </div>
        <input
          type="text"
          name="email"
          value={this.state.email}
          onChange={this.onChange}
          placeholder="Email Address"
        />
        <div 
          onClick={isInvalid ? null : (e) => this.onSubmit(e)}
          className={isInvalid ? "btn btn_disabled" : "btn"}
          >
          RESET PASSWORD
        </div>
        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

const PasswordForgetLink = () => (
  <div>
    <Link to={ROUTES.PASSWORD_FORGET} style={{ color: 'black' }}>Forgot Password?</Link>
  </div>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
