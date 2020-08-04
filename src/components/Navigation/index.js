import React from 'react';
import { Link } from 'react-router-dom';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

const Navigation = (props) => {
  const displayingMenu = props.location.pathname.slice(1,5) === "menu" ? true : false;

  return (
    <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <NavigationAuth authUser={authUser} displayingMenu={displayingMenu} />
          ) : (
            <NavigationNonAuth displayingMenu={displayingMenu} />
          )
        }
    </AuthUserContext.Consumer>
  );
};

const NavigationAuth = ({ authUser, displayingMenu }) => (
  <div className="navBar">
    <Link to={ROUTES.HOME}>Home</Link>
    {(!authUser.isAnonymous && !displayingMenu) && <Link to={ROUTES.ACCOUNT}>Account</Link>}
    {!displayingMenu && <Link to={ROUTES.DASHBOARD}>Dashboard</Link>}
    {!displayingMenu && <SignOutButton authUser={authUser.isAnonymous} />}
    <p onClick={() => console.log(authUser)}>Log</p>
  </div>
);

const NavigationNonAuth = ({ displayingMenu }) => (
  <div className="navBar">
    <Link to={ROUTES.HOME}>Home</Link>
    {!displayingMenu && <Link to={ROUTES.SIGN_IN}>Sign In</Link>}
  </div>
);

export default withRouter(Navigation);
