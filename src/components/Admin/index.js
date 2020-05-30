import React, { Component } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import Dashboard from './dashboard';

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: {},
      menu: {},
      qrCode: ''
    };
  };


  componentDidMount() {
    this.setState({ loading: true });
 
    // fetch current user info
    this.props.firebase.user(this.props.firebase.getCurrentUserUid()).on('value', snapshot => {
      const userObject = snapshot.val();
      userObject.uid = this.props.firebase.getCurrentUserUid();

      this.setState({ user: userObject, loading: false });
    });

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

    this.props.firebase.userMenu(this.props.firebase.getCurrentUserUid()).set({ 
      bebidas: newMenu.bebidas,
      comidas: newMenu.comidas
    });
  }

  createQR = () => {
    const currentUrl = window.location.href;
    let qrUrl = currentUrl.split('').slice(0, currentUrl.length-5).join('');
    qrUrl = qrUrl + "user/" + this.state.user.uid;
    this.setState({ qrCode: `https://api.qrserver.com/v1/create-qr-code/?data=${qrUrl}&amp;size=500x500` })
  }

  // AGREGAR FUNCIONALIDAD, DE QUE SI NO HAY ITEMS EN EL MENU NO SE PUEDE CREAR CODIGO QR
  

  render() {
    const { user, loading, menu, qrCode } = this.state;

    return (
      <div>
        <h1>Admin</h1>
        <h3 onClick={() => console.log(this.state)}>Console log state</h3>
        <p>
          The Admin Page is accessible by every signed in admin user.
        </p>

        {loading && <div>Loading ...</div>}

        <UserList user={user} />

        <hr />
        <Dashboard menu={menu} updateDb={this.updateDb} />
        <hr />

        {/* GENERATE QR CODE WITH PUSH OF A BUTTON and display qr code here */}
        <h3>QR Code</h3>
        <button onClick={this.createQR}>Generate Code</button>

        {qrCode !== '' && (
          <img 
            src={qrCode}
            alt="" 
            title="" 
            />
        )}
      </div>
    );
  }
}

const UserList = ({ user }) => (
  <ul>
    <li>
      <span>
        <strong>E-Mail:</strong> {user.email}
      </span>
      <span>
        <strong>Username:</strong> {user.username}
      </span>
    </li>
  </ul>
);

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AdminPage);
