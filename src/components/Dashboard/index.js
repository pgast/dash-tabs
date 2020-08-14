import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import MenuManager from '../MenuManager';
import OrdersManager from '../OrdersManager';
import TablesManager from '../TablesManager';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      menu: {},
      view: "orders",
      orders: { current: [], past: [] },
    };
  };


  componentDidMount() {
    this.setState({ loading: true });
    // fetch current user info
    this.props.firebase.user(this.props.firebase.getCurrentUserUid()).on('value', snapshot => {
      const userObject = snapshot.val();

      // CHECK FOR DEMO USER LOGGOUT PREVENT CRASH
      if(this.props.firebase.getCurrentUser() === null || this.props.firebase.getCurrentUserUid() === null || userObject === null) return;
      userObject.uid = this.props.firebase.getCurrentUserUid();
      this.setState({ 
        user: userObject, 
        loading: false,  
        userIsAnonymous: this.props.firebase.getCurrentUser().isAnonymous ? true : false, 
      });
    })


    // fetch menu with user uid
    this.props.firebase.userMenu(this.props.firebase.getCurrentUserUid()).on('value', snapshot => {
      this.setState({ menu: snapshot.val() });
    });


    // fetch orders with user uid
    this.props.firebase.userOrders(this.props.firebase.getCurrentUserUid()).on('value', snapshot => {
      let orders = snapshot.val();

      // CHECK FOR DEMO USER LOGOUT PREVENT CRASH
      if(orders === null) return;
      if(orders.current == 0) { orders.current = [] };
      if(orders.past == 0) { 
        console.log('[DASHBOARD] orders past is 0');
        orders.past = 'ooo' 
      };
      this.setState({ orders: snapshot.val() });
    })
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

  toggleView = (input) => this.setState({ view: input });

  createQR = (tableNum, takeOut=false) => {
    const currentUrl = window.location.href;
    let qrUrl = currentUrl.split('').slice(0, currentUrl.length-9).join('');
    qrUrl = `${qrUrl}menu/${this.state.user.uid}/${takeOut ? 'takeout' : tableNum}`;
    console.log(`CURRENT URL: ${currentUrl} / QRURL: ${qrUrl}`);
    return `https://api.qrserver.com/v1/create-qr-code/?data=${qrUrl}&amp;size=500x500`;
  }

  // AGREGAR FUNCIONALIDAD, DE QUE SI NO HAY ITEMS EN EL MENU NO SE PUEDE CREAR CODIGO QR
  

  render() {
    const { loading, menu } = this.state;

    return (
      <div className="dashboard">
        <div className="dashboard_header">
          <h3>Dashboard</h3>
          <h5 onClick={() => console.log(this.props.firebase.getCurrentUser())}>Log current user</h5>
          <p>Dashboard is accessible by every signed in admin user</p>
          <div className="viewToggler">
            <h4 onClick={() => this.toggleView('orders')}>ORDERS</h4>
            <h4 onClick={() => this.toggleView('tables')}>TABLES</h4>
            <h4 onClick={() => this.toggleView('menu')}>MENU MANAGER</h4>
          </div>
        </div>

        {this.state.view === "orders" && <OrdersManager dbOrders={this.state.orders} updateOrdersDb={this.updateOrdersDb}/>}
        {this.state.view === "tables" && <TablesManager createQR={this.createQR} dbTables={this.state.user.tables} updateTablesDb={this.updateTablesDb}/>}
        {this.state.view === "menu" && <MenuManager menu={menu} updateMenuDb={this.updateMenuDb} />}

        {loading && <div>Loading ...</div>}
      </div>
    );
  }
}

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(Dashboard);
