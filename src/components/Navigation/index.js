import React, { useContext } from 'react';
import { compose } from 'react-recompose';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { faReceipt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './style.css';
import { Store } from '../../store';
import SignOutButton from '../SignOut';
import { withFirebase } from '../Firebase';
import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';


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
  const updateSideboardState = (mode) => dispatch({ type: 'TOGGLE_SIDEBOARD', payload: mode });
  let parameter = window.location.href.split('').slice(-9).join('');

  const toggleToOrders = () => {
    toggleView('orders');
    updateSideboardState(false);
  };

  return (
    <div className="navBar">
      <div>
        <div id="logo">
          <FontAwesomeIcon icon={faReceipt}/>
          <Link 
            to={ROUTES.HOME}
            onClick={() => toggleToOrders()}
            style={{ textDecoration: 'none', color: 'white' }}
          >
              DASH-TABS
            </Link>
        </div>
        {(!displayingMenu && parameter === "dashboard") && (
          <div className="navLinks dashboardLinks">
            <div>
              <p 
                onClick={() => toggleToOrders()}
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
            onClick={() => toggleView('orders')}
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
      <FontAwesomeIcon icon={faReceipt}/>
      <Link style={{ textDecoration: 'none', color: 'white' }} to={ROUTES.HOME}>DASH-TABS</Link>
    </div>
    <div className="navLinks bottomNav">
      {!displayingMenu && <Link style={{ textDecoration: 'none', color: 'white' }} to={ROUTES.SIGN_IN}>SIGN IN</Link>}
    </div>
  </div>
);

export default compose(
  withRouter,
  withFirebase,
)(Navigation);
