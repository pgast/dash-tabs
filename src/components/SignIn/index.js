import React, { Component, useState, useEffect } from 'react';
import { compose } from 'react-recompose';
import { withRouter, Link } from 'react-router-dom';
import { faCaretLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.css';
import Modal from '../Modals';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import MobileModal from '../Modals/MobileModal';
import { PasswordForgetLink } from '../PasswordForget';

const SignInPage = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      setShowModal(true);
     };
  })

  return (
    <div className="signInView">
      <div id="backBtn">
        <Link to={ROUTES.HOME} style={{ color: 'black' }}>
          <FontAwesomeIcon icon={faCaretLeft} size="2x" />
        </Link>
      </div>
      <div className="mobileHeader">
        <h3>SIGN IN</h3>
      </div>

      <div className="dashboardHeader">
        <h1>SIGN IN</h1>
      </div>
      <div>
        <SignInForm />
        <PasswordForgetLink />
        <SignUpLink />
      </div>
      <Modal show={showModal}>
        <MobileModal />
      </Modal>
    </div>
  );
};

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.DASHBOARD);
        this.props.firebase.demoCleanupDb();
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
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <div className="signInForm">
        <input
          type="text"
          name="email"
          value={email}
          onChange={this.onChange}
          placeholder="Email Address"
        />
        <input
          name="password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={this.onChange}
        />
        <div 
          onClick={isInvalid ? null : (e) => this.onSubmit(e)}
          className={isInvalid ? "btn btn_disabled" : "btn"}
          >
          SIGN IN
        </div>
        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };
