import React, { Component } from 'react';
import { compose } from 'react-recompose';

import { withFirebase } from '../Firebase';
import DashboardView from './dashboardView';
import { withAuthorization } from '../Session';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      menu: {},
      orders: { current: [], past: [] },
      showModal: false,
      isMobile: false,
    };
  };

  componentDidMount() {
    this.setState({ loading: true });
    let userUid = this.props.firebase.getCurrentUserUid();
    let userIsAnonymous = this.props.firebase.getCurrentUser().isAnonymous ? true : false;
    this.setState({
      loading: false,
      userIsAnonymous,
      showModal: userIsAnonymous,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    });

    this.props.firebase.user(userUid).on('value', snapshot => {
      const userObject = snapshot.val();
      // check for demo user logout prevent crash
      if(this.props.firebase.getCurrentUser() === null || this.props.firebase.getCurrentUserUid() === null || userObject === null) return;
      userObject.uid = userUid;
      this.setState({ user: userObject });
    })

    // fetch menu with user uid
    this.props.firebase.userMenu(userUid).on('value', snapshot => {
      this.setState({ menu: snapshot.val() });
    });

    // fetch orders with user uid
    this.props.firebase.userOrders(userUid).on('value', snapshot => {
      let orders = snapshot.val();
      // check for demo user logout prevent crash
      if(orders === null) return;
      this.setState({ orders: snapshot.val() });
    })
  }

  componentWillUnmount() {       
    this.props.firebase.users().off();
  }

  updateMenuDb = (newMenu) => {
    // check that items are always arrays with items or 0
    if(newMenu.drinks.length === 0) newMenu.drinks = 0;
    if(newMenu.dishes.length === 0) newMenu.dishes = 0;
    // change second props with user uid in state
    this.props.firebase.userMenu(this.state.user.uid).set({ 
      drinks: newMenu.drinks,
      dishes: newMenu.dishes
    });
  }

  updateTablesDb = (newTables) => {
    if(newTables.length === 0) newTables = 0;
    this.props.firebase.userTables(this.state.user.uid).set(newTables);
  }

  updateOrdersDb = (newOrders) => {
    this.props.firebase.userOrders(this.state.user.uid).set(newOrders);
  }

  createQR = (tableNum, takeOut=false) => {
    const currentUrl = window.location.href;
    let qrUrl = currentUrl.split('').slice(0, currentUrl.length-9).join('');
    qrUrl = `${qrUrl}menu/${this.state.user.uid}/${takeOut ? 'takeout' : tableNum}`;
    return `https://api.qrserver.com/v1/create-qr-code/?data=${qrUrl}&amp;size=500x500`;
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    const { loading, menu, orders, showModal, isMobile } = this.state;
    return (
      <DashboardView 
        menu={menu}
        orders={orders}
        loading={loading}
        isMobile={isMobile}
        showModal={showModal}
        createQR={this.createQR}
        toggleModal={this.toggleModal}
        tables={this.state.user.tables}
        updateMenuDb={this.updateMenuDb}
        updateOrdersDb={this.updateOrdersDb}
        updateTablesDb={this.updateTablesDb}
      />
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Dashboard);
