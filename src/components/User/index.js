import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class UserPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFetched: false,
      uid: 'Numy9lwiESOAoXuP8mBRxoNXLcq1',
      menu: {}
    };
  };

  componentWillMount() {
    this.fetchMenu(this.props.match.params.uid);
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  fetchMenu = (uid) => {
    this.props.firebase.userMenu(uid).on('value', snapshot => {
      this.setState({ menu: snapshot.val(), dataFetched: true });
    });
  }

  render() {
    const { dataFetched } = this.state;
    const { bebidas, comidas } = this.state.menu;

    return (
      <div>

        {!dataFetched ? (
          <>
            <h1>User</h1>
            <h3 onClick={() => console.log(this.state)}>Console log state</h3>
          </>
        )
          :
        (
          <>
            <h4>Bebidas</h4>
            <ol>
              {bebidas && bebidas.map((el, idx) => 
                <li key={idx} onClick={() => this.editItem(el, 'bebidas')}>{el.name} - ${el.price}</li> 
              )}
            </ol>

            <h4>Comidas</h4>
            <ol>
              {comidas && comidas.map((el, idx) => 
                <li key={idx} onClick={() => this.editItem(el, 'comidas')}>{el.name} - ${el.price}</li>        
              )}
            </ol>
          </>
        )}
      </div>
    );
  }
}

export default withFirebase(UserPage);
