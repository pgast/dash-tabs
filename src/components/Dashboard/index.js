import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import DashboardView from './dashboardView';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      menu: {},
      orders: { current: [], past: [] },
      showModal: false,
    };
  };

  componentDidMount() {
    this.setState({ loading: true });
    let userUid = this.props.firebase.getCurrentUserUid();
    let userIsAnonymous = this.props.firebase.getCurrentUser().isAnonymous ? true : false;
    // fetch current user info
    this.props.firebase.user(userUid).on('value', snapshot => {
      const userObject = snapshot.val();

      // CHECK FOR DEMO USER LOGGOUT PREVENT CRASH
      if(this.props.firebase.getCurrentUser() === null || this.props.firebase.getCurrentUserUid() === null || userObject === null) return;
      userObject.uid = userUid;
      this.setState({ 
        loading: false,  
        userIsAnonymous, 
        user: userObject, 
        showModal: userIsAnonymous,
      });
    })


    // fetch menu with user uid
    this.props.firebase.userMenu(userUid).on('value', snapshot => {
      this.setState({ menu: snapshot.val() });
    });


    // fetch orders with user uid
    this.props.firebase.userOrders(userUid).on('value', snapshot => {
      let orders = snapshot.val();
      // CHECK FOR DEMO USER LOGOUT PREVENT CRASH
      if(orders === null) return;
      this.setState({ orders: snapshot.val() });
    })

    console.log(this.state);
  }

  componentWillUnmount() {       
    this.props.firebase.users().off();
  }

  updateMenuDb = (newMenu) => {
    // REVISAR QUE SEAN SIEMPRE ARRAYS CON ITEMS O SOLO 0 
    if(newMenu.drinks.length === 0) newMenu.drinks = 0;
    if(newMenu.dishes.length === 0) newMenu.dishes = 0;

      // CAMBIAR EL SEGUNDO THIS PROPS YA CON USER UID EN ESTADO
    this.props.firebase.userMenu(this.state.user.uid).set({ 
      drinks: newMenu.drinks,
      dishes: newMenu.dishes
    });
  }

  updateTablesDb = (newTables) => {
    // REVISAR QUE SEA SIEMPRE ARRAY CON ITEMS O SOLO 0
    if(newTables.length === 0) newTables = 0;

    // CAMBIAR EL SEGUNDO THIS PROPS YA CON USER UID EN ESTADO
    // this.props.firebase.user(this.state.user.uid).set({ tables: newTables });
    this.props.firebase.userTables(this.state.user.uid).set(newTables);
  }

  updateOrdersDb = (newOrders) => {
    this.props.firebase.userOrders(this.state.user.uid).set(newOrders);
  }

  createQR = (tableNum, takeOut=false) => {
    const currentUrl = window.location.href;
    let qrUrl = currentUrl.split('').slice(0, currentUrl.length-9).join('');
    qrUrl = `${qrUrl}menu/${this.state.user.uid}/${takeOut ? 'takeout' : tableNum}`;
    console.log(`CURRENT URL: ${currentUrl} / QRURL: ${qrUrl}`);
    return `https://api.qrserver.com/v1/create-qr-code/?data=${qrUrl}&amp;size=500x500`;
  }

  toggleModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  // AGREGAR FUNCIONALIDAD, DE QUE SI NO HAY ITEMS EN EL MENU NO SE PUEDE CREAR CODIGO QR
  render() {
    const { loading, menu, orders, showModal } = this.state;

    return (
      <DashboardView 
        menu={menu}
        orders={orders}
        loading={loading}
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
