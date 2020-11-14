import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { StoreProvider } from '../../store';

import Menu from '../Menu';
import HomePage from '../Home';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import AccountPage from '../Account';
import Dashboard from '../Dashboard';
import Navigation from '../Navigation';
import { withAuthentication } from '../Session';
import * as ROUTES from '../../constants/routes';
import PasswordForgetPage from '../PasswordForget';

const App = () => (
  <StoreProvider>
    <Router>
      <div>
        <Navigation />
        <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
        <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
        <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
        <Route exact path={ROUTES.HOME} component={HomePage} />
        <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
        <Route exact path={ROUTES.DASHBOARD} component={Dashboard} />
        <Route exact path={`${ROUTES.MENU}/:uid/:table`} component={Menu} />
      </div>
    </Router>
  </StoreProvider>
);

export default withAuthentication(App);