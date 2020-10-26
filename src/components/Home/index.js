import React, { Component } from 'react';
import HomeView from './homeView';
import * as ROUTES from '../../constants/routes';

import * as DEMODATA from '../../constants/demoData';
import { withFirebase } from '../Firebase';

class HomePage extends Component {
  constructor(props) {
    super(props);
  };

  launchDemo = () => {
    this.props.firebase.doSignOut();
    this.props.firebase.doSignInAnonymously()
      .then(() => {
        let currentUid = this.props.firebase.getCurrentUserUid();
        this.props.firebase.userOrders(currentUid).set(DEMODATA.ORDERS);
        this.props.firebase.userMenu(currentUid).set(DEMODATA.MENU);
        this.props.firebase.user(currentUid).set(DEMODATA.USER);
        this.props.firebase.demoCleanupDb();
        let clientMenuUrl = `${window.location.href}menu/${currentUid}/takeout`;
        this.props.history.push(ROUTES.DASHBOARD);
        window.open(clientMenuUrl, "_blank") //to open new page
      });

  };

  render() {
    return <HomeView launchDemo={this.launchDemo} signUpRoute={ROUTES.SIGN_UP} />
  };
};

export default withFirebase(HomePage);