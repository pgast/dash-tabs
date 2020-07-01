import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFetched: false,
      error: false,
      menu: { drinks: 0, dishes: 0 },
      table: ''
    };
  };

  componentWillMount() {
    this.fetchMenu(this.props.match.params.uid);
    // conseguir params mesa del url.
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  fetchMenu = (uid) => {
    this.props.firebase.userMenu(uid).on('value', snapshot => {
      if(snapshot.val() !== null) {
        let newMenu = { drinks: 0, dishes: 0 };
        if(snapshot.val().dishes !== 0) newMenu.dishes = snapshot.val().dishes.filter(el => el.available);
        if(snapshot.val().drinks !== 0) newMenu.drinks = snapshot.val().drinks.filter(el => el.available);
        
        // this.setState({ menu: newMenu, dataFetched: true });
        this.setState({ menu: newMenu, dataFetched: true, table: this.props.match.params.table });

      } else {
        this.setState({ error: 'data not found' });
      }
    });
  }

  render() {
    const { dataFetched } = this.state;
    const { drinks, dishes } = this.state.menu;

    const drinksIsEmpty = (drinks.length === 0 || drinks === 0 ) ? true : false;
    const dishesIsEmpty = (dishes.length === 0 || dishes === 0 ) ? true : false;

    return (
      <div>
        {!dataFetched ? (
          <>
            <h1>Menu</h1>
          </>
        )
          :
        (
          <>
            <h2>Table {this.state.table}</h2>
            <h4 onClick={() => console.log(this.state)}>Bebidas</h4>
            {drinksIsEmpty ? 
              <h3>No hay bebidas registradas</h3>
            :
              <ol>
                {drinks && drinks.map((el, idx) =>
                  <li key={idx} onClick={() => this.editItem(el, 'bebidas')}>{el.name} - ${el.price}</li>
                )}
              </ol>
            }

            <h4>Comidas</h4>
            {dishesIsEmpty ? 
              <h3>No hay comidas registradas</h3>
            :
              <ol>
                {dishes && dishes.map((el, idx) => 
                  <li key={idx} onClick={() => this.editItem(el, 'comidas')}>{el.name} - ${el.price}</li>        
                )}
              </ol>
            }
          </>
        )}

        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default withFirebase(Menu);