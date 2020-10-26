import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import './style.css';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';
import { withRouter } from 'react-router-dom';

import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import { Store } from '../../store';


const Navigation = (props) => {
  const displayingMenu = props.location.pathname.slice(1,5) === "menu" ? true : false;
  const history = props.history;

  return (
    <AuthUserContext.Consumer>
        {authUser =>
          authUser ? (
            <NavigationAuth authUser={authUser} displayingMenu={displayingMenu} history={history}/>
          ) : (
            <NavigationNonAuth displayingMenu={displayingMenu} />
          )
        }
    </AuthUserContext.Consumer>
  );
};

const NavigationAuth = ({ authUser, displayingMenu, history }) => {
  const { state, dispatch } = useContext(Store);
  const toggleView = view => dispatch({ type: 'TOGGLE_VIEW', payload: view });
  let parameter = window.location.href.split('').slice(-9).join('');

  return (
    <div className="navBar">
      <div>
        <div id="logo">
          <Link 
            style={{ textDecoration: 'none' }}
            onClick={() => toggleView=('orders')}
            to={ROUTES.HOME}
            >
              DASH-TABS
            </Link>
        </div>
        {(!displayingMenu && parameter === "dashboard") && (
          <div className="navLinks dashboardLinks">
            <div>
              <p 
                onClick={() => toggleView('orders')} 
                id={state.view !== 'orders' && "inactiveLink"}
              >
                ORDERS
              </p>
              <span id={state.view === 'orders' && 'navDash'}></span>
            </div>
            <div>
              <p 
                onClick={() => toggleView('tables')} 
                id={state.view !== 'tables' && 'inactiveLink'}
              >
                TABLES
              </p>
              <span id={state.view === 'tables' && 'navDash'}></span>
            </div>
            <div>
              <p 
                onClick={() => toggleView('menu')} 
                id={state.view !== 'menu' && 'inactiveLink'}
              >
                MENU
              </p>
              <span id={state.view === 'menu' && 'navDash'}></span>
            </div>
          </div>
        )}
      </div>
      <div className="navLinks bottomNav">
        {!displayingMenu && <Link style={{ textDecoration: 'none', color: 'white' }} to={ROUTES.DASHBOARD}>DASHBOARD</Link>}
        {(!authUser.isAnonymous && !displayingMenu) && 
          <Link 
            to={ROUTES.ACCOUNT}
            onClick={() => toggleView=('orders')}
            style={{ textDecoration: 'none', color: 'white' }} 
            >
              ACCOUNT
            </Link>
        }
        {!displayingMenu && <SignOutButton userIsAnonymous={authUser.isAnonymous} history={history} />}
      </div>
    </div>
  );
};

const NavigationNonAuth = ({ displayingMenu }) => (
  <div className="navBar">
    <div id="logo">
      <Link style={{ textDecoration: 'none', color: 'white' }} to={ROUTES.HOME}>DASH-TABS</Link>
    </div>
    <div className="navLinks">
      {!displayingMenu && <Link style={{ textDecoration: 'none' }} to={ROUTES.SIGN_IN}>SIGN IN</Link>}
    </div>
  </div>
);

export default compose(
  withRouter,
  withFirebase,
)(Navigation);
