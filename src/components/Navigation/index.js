import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

import { compose } from 'recompose';
import { withFirebase } from '../Firebase';


const Navigation = (props) => {
  const displayingMenu = props.location.pathname.slice(1,5) === "menu" ? true : false;
  const history = props.history;

  return (
    <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <NavigationAuth authUser={authUser} displayingMenu={displayingMenu} history={history} firebase={props.firebase}/>
          ) : (
            <NavigationNonAuth displayingMenu={displayingMenu} />
          )
        }
    </AuthUserContext.Consumer>
  );
};

const NavigationAuth = ({ authUser, displayingMenu, history, firebase }) => (
  <div className="navBar">
    <Link to={ROUTES.HOME}>Home</Link>
    {(!authUser.isAnonymous && !displayingMenu) && <Link to={ROUTES.ACCOUNT}>Account</Link>}
    {!displayingMenu && <Link to={ROUTES.DASHBOARD}>Dashboard</Link>}
    {!displayingMenu && <SignOutButton userIsAnonymous={authUser.isAnonymous} history={history} />}
    <p onClick={() => firebase.cleanupDb()}>Log DB</p>
  </div>
);

const NavigationNonAuth = ({ displayingMenu }) => (
  <div className="navBar">
    <Link to={ROUTES.HOME}>Home</Link>
    {!displayingMenu && <Link to={ROUTES.SIGN_IN}>Sign In</Link>}
  </div>
);

// export default withRouter(Navigation);

export default compose(
  withRouter,
  withFirebase,
)(Navigation);
