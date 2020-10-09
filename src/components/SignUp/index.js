import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import './style.css';

const SignUpPage = () => (
  <div className="signupView">
    <div className="dashboardHeader">
      <h1>SIGN UP</h1>
    </div>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  businessName: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, businessName } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)

      .then(authUser => {
        this.props.firebase.user(authUser.user.uid)
        // agregar en tables el takeout point y generarlo cuando se cree usuario
        .set({ username, email, tables: 0, businessName })
        
        .then(() => {
          this.props.firebase.userMenu(authUser.user.uid)
          .set({ drinks: 0, dishes: 0 })

          .then(() => {
            this.props.firebase.userOrders(authUser.user.uid)
            .set({ current: 0, past: 0 })
          })
        })
      })
      
      .catch(error => {
        this.setState({ error });
      });

      this.setState({ ...INITIAL_STATE });
      this.props.history.push(ROUTES.HOME);
      event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
      businessName
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      businessName === '' ||
      username === '';

    return (
      <div>
        <div>
          <div>
            <h3>NAME</h3>
            <input
              type="text"
              name="username"
              value={username}
              onChange={this.onChange}
            />
          </div>
          <div>
            <h3>E-MAIL</h3>
            <input
              type="text"
              name="email"
              value={email}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div>
          <div>
            <h3>PASSWORD</h3>
            <input
              type="password"
              name="passwordOne"
              value={passwordOne}
              onChange={this.onChange}
            />
          </div>
          <div>
            <h3>CONFIRM PASSWORD</h3>
            <input
              type="password"
              name="passwordTwo"
              value={passwordTwo}
              onChange={this.onChange}
            />
          </div>
        </div>
        <div>
          <h3>BUSINESS NAME</h3>
          <input
            type="text"
            name="businessName"
            value={businessName}
            onChange={this.onChange}
          />
        </div>
        <div 
          onClick={isInvalid ? null : () => this.onSubmit()}
          className={isInvalid ? "btn btn_disabled" : "btn"}
          >
          CREATE ACCOUNT
        </div>

        {error && <p>{error.message}</p>}
      </div>
    );
  }
}

const SignUpLink = () => (
  <div>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </div>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };
