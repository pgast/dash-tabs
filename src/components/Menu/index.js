import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFetched: false,
      error: false,
      menu: { drinks: 0, dishes: 0 },
      table: '',
      order: {
        cost: 0,
        end: "23:03",
        ready: false,
        start: "12:36",
        table: 5,
        items: {
          dishes: [],
          drinks: [],
        }
      },
    };
  };

  componentWillMount() {
    this.fetchMenu(this.props.match.params.uid);
    // VER SI SE PUEDE PASAR LOS VALIDADORES DE ORDEN A OTRA FUNCION Y NO EN EL MONTADO
    this.orderIsValid(this.props.match.params.uid);
    this.tableIsValid(this.props.match.params.uid);
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
        
        this.setState({ 
          menu: newMenu, 
          dataFetched: true, 
          table: Number(this.props.match.params.table),
          order: { ...this.state.order, table: Number(this.props.match.params.table)},
        });

      } else {
        this.setState({ error: 'data not found' });
      }
    });
  }

  tableIsValid = (uid) => {
    let tableIsValid = false;
    this.props.firebase.userTables(uid).on('value', snapshot => {
      if(snapshot.val() !== null) {
        let fetchedTables = snapshot.val();
        for(let i=0; i<fetchedTables.length; i++) {
          if(fetchedTables[i].number === this.state.table) {
            tableIsValid = true;
            break;
          }
        }
      }
      this.setState({ tableIsValid });
    })
  }

  orderIsValid = (uid) => {
    let orderIsValid = true;
    let fetchedOrders;
    this.props.firebase.userOrders(uid).on('value', async snapshot => {
      if(snapshot.val() !== null) {
        fetchedOrders = snapshot.val();
        for(let i=0; i<fetchedOrders.current.length; i++) {
          if(fetchedOrders.current[i].table === this.state.table) {
            orderIsValid = false;
            break;
          }
        }
      }
      this.setState({ orderIsValid, fetchedOrders });
    })
  }

  sendOrder = (uid) => {
    // check if table is valid
    if(this.state.tableIsValid === false) {
      console.log('table is invalid');
      this.setState({ error: "Check table number" });
      return;
    }

    // check if order is valid
    if(this.state.orderIsValid === false) {
      console.log('order is invalid');
      this.setState({ error: "Order number is invalid" });
      return;
    }

    console.log('final block');

    let newOrders = {...this.state.fetchedOrders};
    let order = {...this.state.order};
    // first if order is empty and set empty categories to 0;
    if(order.items.dishes.length === 0) {
      order.items.dishes = 0;
    }

    if(order.items.drinks.length === 0) {
      order.items.drinks = 0;
    }

    newOrders.current.push(order);
    this.props.firebase.userOrders(uid).set(newOrders);
  }

  itemExistsInOrder = (name, type) => {
    // inmutable
    let exists = this.state.order.items[type].find(item => item.name === name);
    return exists === undefined ? false : true;
  }

  upgradeCost = (price, item, type) => {
    if(price !== undefined) {
      return this.state.order.cost + price;
    } else {
      // recibir item name / item
      // buscar el precio en menu
      let foundItem = this.state.menu[type].find(el => el.name === item.name)
      // agregar el precio al costo
      // inmutable!
      // return this.state.order.cost + price
    }
  };

  addItem = (item, type) => {
    if(this.itemExistsInOrder(item.name, type)) return;
    let newCost = this.upgradeCost(item.price);
    let orderItem = { name: item.name, qty: 1 };

    if(type === 'dishes') {
      let newDishes = [...this.state.order.items.dishes];
      newDishes.push(orderItem);
      this.setState({ 
        ...this.state, 
        order: { 
          ...this.state.order, 
          items: { ...this.state.order.items, dishes: newDishes },
          cost: newCost,
        } 
      })
    }

    if(type === 'drinks') {
      let newDrinks = [...this.state.order.items.drinks];
      newDrinks.push(orderItem);
      this.setState({
        ...this.state, 
        order: { 
          ...this.state.order, 
          items: { ...this.state.order.items, drinks: newDrinks },
          cost: newCost,
        }
      })
    }
  }

  deleteItem = (item, type) => {
    let newOrders = {...this.state.order};
    newOrders.items[type] = newOrders.items[type].filter(el => el.name !== item.name);
    
    // inmutable!
    let itemCost = this.state.menu[type].find(el => el.name === item.name);
    itemCost = -Math.abs(itemCost.price * item.qty);
    newOrders.cost = this.upgradeCost(itemCost);
    this.setState({ order: newOrders });

  }

  upgradeItemQty = (item, type, qty) => {
    
    // copy orders
    let newOrder = {...this.state.order};
    // find item and copy
    let upgradedItem = newOrder.items[type].find(el => el.item === item);
    
    // if current item qty is 1 and input qty is -1 do nothing
    if(upgradedItem.qty === 1 && qty === -1) return;


    // upgrade item qty not less than 1
    upgradedItem.qty = upgradedItem.qty + qty;
    // filter out item from array (dishes, drinks)
    newOrder.items[type] = newOrder.items[type].filter(el => el.item !== item) 
    // add new updated item to array (dishes, drinks)
    newOrder.items[type].push(upgradedItem);
    // update state with newOrder 
    this.setState({ order: newOrder });
  }

  render() {
    const orderIsEmpty = this.state.order.items.dishes.length === 0 && this.state.order.items.drinks.length === 0;

    const { dataFetched, order } = this.state;
    const { drinks, dishes } = this.state.menu;

    const drinksIsEmpty = (drinks.length === 0 || drinks === 0 ) ? true : false;
    const dishesIsEmpty = (dishes.length === 0 || dishes === 0 ) ? true : false;
    const orderDrinksIsEmpty = order.items.drinks.length === 0 ? true : false;
    const orderDishesIsEmpty = order.items.dishes.length === 0 ? true : false;

    return (
      <div className="clientMenu"> 
        {!dataFetched ? (
          <>
            <h1>Menu</h1>
          </>
        )
          :
        (
          <>
            <h2 onClick={() => console.log(this.state)}>Table {this.state.table}</h2>
            <div className="menu">
              <div>
                <h4 onClick={() => console.log(this.state)}>Bebidas</h4> 
                {drinksIsEmpty ? 
                  <h3>No hay bebidas registradas</h3>
                :
                  <ol>
                    {drinks && drinks.map((item, idx) =>
                      <li key={idx} onClick={() => this.addItem(item, 'drinks')}>{item.name} - ${item.price}</li>
                    )}
                  </ol>
                }
              </div>
              <div>
                <h4>Comidas</h4>
                {dishesIsEmpty ? 
                  <h3>No hay comidas registradas</h3>
                :
                  <ol>
                    {dishes && dishes.map((item, idx) => 
                      <li key={idx} onClick={() => this.addItem(item, 'dishes')}>{item.name} - ${item.price}</li>        
                    )}
                  </ol>
                }
              </div>
            </div>

            <div className="clientMenu_orderForm">
              <div>
                <div>
                  {!orderDrinksIsEmpty && (
                    <>
                      <h4>Drinks</h4>
                      <ul>
                        {order.items.drinks.map((item, idx) => 
                          <li key={idx}>
                            <div>
                              {item.name} - x {item.qty}
                            </div>
                            <div id="itemQty">
                              <div>
                                <button onClick={() => this.upgradeItemQty(item.name, 'drinks', 1)}>+</button>
                              </div>
                              <div>
                                <button onClick={() => this.upgradeItemQty(item.name, 'drinks', -1)}>-</button>
                              </div>
                            </div>
                            <button onClick={() => this.deleteItem(item, 'drinks')}>X</button>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
                <div>
                  {!orderDishesIsEmpty && (
                    <>
                      <h4>Dishes</h4>
                      <ul>
                        {order.items.dishes.map((item, idx) => 
                          <li key={idx}>
                            <div>
                              {item.name} - x {item.qty}
                            </div>
                            <div id="itemQty">
                              <div>
                                <button onClick={() => this.upgradeItemQty(item.name, 'dishes', 1)}>+</button>
                              </div>
                              <div>
                                <button onClick={() => this.upgradeItemQty(item.name, 'dishes', -1)}>-</button>
                              </div>
                            </div>
                            <button onClick={() => this.deleteItem(item, 'dishes')}>X</button>
                          </li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
              </div>
              <hr />
              <div>
                <h3>Order cost: ${this.state.order.cost}</h3>
                <button disabled={orderIsEmpty} onClick={() => this.sendOrder(this.props.match.params.uid)}>TEST ORDER</button>
              </div>
            </div>
          </>
        )}

        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default withFirebase(Menu);



// FLAN cant 1, (con numeros para aumentar o disminuir cantidad)      eliminar
// si se da clic a lo mismo en el menu no pasa nada 


// cuando se agrega algo abajo sale el total de la orden