import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import * as DEMODATA from '../../constants/demoData';
import { withFirebase } from '../Firebase';

class HomePage extends Component {
  constructor(props) {
    super(props);
  };
// const HomePage = ({firebase, history}) => {

  launchDemo = () => {
    // sign out
    this.props.firebase.doSignOut();

    // sign In anonymously
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
    return (
      <div>
        <h1>Home Page</h1>
  
        <Link to={ROUTES.SIGN_UP}>CREATE ACCOUNT</Link>
  
        <h3 onClick={() => this.launchDemo()}>TRY IT</h3>
        {/*  sign out de lo que esten ahorita y sign in con cuenta de demo 
        que envie a dashboard y abra otra pestana como takeout */}
      </div>
    );
  };
};

export default withFirebase(HomePage);