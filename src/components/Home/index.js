import React from 'react';

import HomeView from './homeView';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';
import * as DEMODATA from '../../constants/demoData';

const HomePage = (props) => {
  const launchDemo = () => {
    props.firebase.doSignOut();
    props.firebase.doSignInAnonymously()
      .then(() => {
        let currentUid = props.firebase.getCurrentUserUid();
        props.firebase.userOrders(currentUid).set(DEMODATA.ORDERS);
        props.firebase.userMenu(currentUid).set(DEMODATA.MENU);
        props.firebase.user(currentUid).set(DEMODATA.USER);
        props.firebase.demoCleanupDb();
        let clientMenuUrl = `${window.location.href}menu/${currentUid}/takeout`;
        props.history.push(ROUTES.DASHBOARD);
        window.open(clientMenuUrl, "_blank");
      });
  };
  return <HomeView launchDemo={launchDemo} signUpRoute={ROUTES.SIGN_UP} signInRoute={ROUTES.SIGN_IN} />
};

export default withFirebase(HomePage);