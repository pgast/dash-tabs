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
      qrCode: '',
      view: "orders"
    };
  };

    /* TABLES 
     num de mesa input 
      descripcion de ubicacion o mesa
      tiene orden actual = true / false
    */


  componentDidMount() {
    this.setState({ loading: true });
 
    // fetch current user info
    this.props.firebase.user(this.props.firebase.getCurrentUserUid()).on('value', snapshot => {
      const userObject = snapshot.val();
      userObject.uid = this.props.firebase.getCurrentUserUid();

      this.setState({ user: userObject, loading: false });
    })


    // fetch menu with user uid
    this.props.firebase.userMenu(this.props.firebase.getCurrentUserUid()).on('value', snapshot => {
      this.setState({ menu: snapshot.val() });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  updateDb = (newMenu) => {
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
    this.props.firebase.user(this.state.user.uid).set({ tables: newTables });
  }

  toggleView = (input) => this.setState({ view: input });

  createQR = () => {
    const currentUrl = window.location.href;
    let qrUrl = currentUrl.split('').slice(0, currentUrl.length-9).join('');
    qrUrl = qrUrl + "menu/" + this.state.user.uid;
    console.log(`CURRENT URL: ${currentUrl} / QRURL: ${qrUrl}`);
    this.setState({ qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${qrUrl}&amp;size=500x500` })
  }

  // AGREGAR FUNCIONALIDAD, DE QUE SI NO HAY ITEMS EN EL MENU NO SE PUEDE CREAR CODIGO QR
  

  render() {
    const { loading, menu, qrCode } = this.state;

    return (
      <div className="dashboard">
        <div className="dashboard_header">
          <h3>Dashboard</h3>
          <h5 onClick={() => console.log(this.state)}>Log state</h5>
          <p>Dashboard is accessible by every signed in admin user</p>
          <div className="viewToggler">
            <h4 onClick={() => this.toggleView('orders')}>ORDERS</h4>
            <h4 onClick={() => this.toggleView('tables')}>TABLES</h4>
            <h4 onClick={() => this.toggleView('menu')}>MENU MANAGER</h4>
          </div>
        </div>

        {this.state.view === "orders" && <OrdersManager />}
        {this.state.view === "tables" && <TablesManager createQR={this.createQR} qrCode={qrCode} dbTables={this.state.user.tables} updateTablesDb={this.updateTablesDb}/>}
        {this.state.view === "menu" && <MenuManager menu={menu} updateDb={this.updateDb} />}

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
