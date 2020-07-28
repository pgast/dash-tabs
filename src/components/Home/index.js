import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import { defaultProps } from 'recompose';
import { withFirebase } from '../Firebase';

// const HomePage = (props) => {
const HomePage = ({firebase, history}) => {

  const launchDemo = () => {
    // demo client menu url
    const clientMenuUrl = `${window.location.href}menu/${process.env.REACT_APP_DEMO_UID}/takeout`;
    // sign out
    firebase.doSignOut();
    // sign in con demo account

    firebase.doSignInWithEmailAndPassword(process.env.REACT_APP_DEMO_EMAIL, process.env.REACT_APP_DEMO_PWD)
    .then(() => {
      history.push(ROUTES.DASHBOARD);
    });
    // open new tab with menu
    window.open(clientMenuUrl, "_blank") //to open new page
  };


  return (
    <div>
      <h1>Home Page</h1>
      <p>Landing and home page</p>

      <Link to={ROUTES.SIGN_UP}>CREATE ACCOUNT</Link>

      <h3 onClick={() => launchDemo()}>TRY IT</h3>
      {/*  sign out de lo que esten ahorita y sign in con cuenta de demo 
      que envie a dashboard y abra otra pestana como takeout */}
    </div>
  )
};

export default withFirebase(HomePage);