import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import User from '../User';
import HomePage from '../Home';
import AdminPage from '../Admin';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import LandingPage from '../Landing';
import AccountPage from '../Account';
import Navigation from '../Navigation';
import PasswordForgetPage from '../PasswordForget';

import * as ROUTES from '../../constants/routes';
import { withAuthentication } from '../Session';

const App = () => (
  <Router>
    <div>
      <Navigation />

      <hr />

      <Route exact path={ROUTES.LANDING} component={LandingPage} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route
        exact
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={`${ROUTES.USER}/:uid`} component={User} />
    </div>
  </Router>
);

export default withAuthentication(App);
