import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';
import * as DEMODATA from '../../constants/demoData';
import { defaultProps } from 'recompose';
import { withFirebase } from '../Firebase';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  };
// const HomePage = ({firebase, history}) => {

  launchDemo = () => {
    // sign out
    this.props.firebase.doSignOut();

    // sign In anonymously
    this.props.firebase.doSignInAnonymously()
      .then(() => {
        this.props.firebase.userOrders(this.props.firebase.getCurrentUserUid()).set(DEMODATA.ORDERS);
        this.props.firebase.userMenu(this.props.firebase.getCurrentUserUid()).set(DEMODATA.MENU);
        this.props.firebase.user(this.props.firebase.getCurrentUserUid()).set(DEMODATA.USER);
        let clientMenuUrl = `${window.location.href}menu/${this.props.firebase.getCurrentUserUid()}/takeout`;
        this.props.history.push(ROUTES.DASHBOARD);
        window.open(clientMenuUrl, "_blank") //to open new page
      });

  };

  render() {
    return (
      <div>
        <h1 onClick={() => console.log(this.props.firebase.getCurrentUserUid())}>Home Page</h1>
  
        <Link to={ROUTES.SIGN_UP}>CREATE ACCOUNT</Link>
  
        <h3 onClick={() => this.launchDemo()}>TRY IT</h3>
        {/*  sign out de lo que esten ahorita y sign in con cuenta de demo 
        que envie a dashboard y abra otra pestana como takeout */}
      </div>
    );
  };
};

export default withFirebase(HomePage);