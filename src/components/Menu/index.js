import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataFetched: false,
      orderSent: false,
      error: false,
      menu: { drinks: 0, dishes: 0 },
      table: '',
      order: {
        cost: 0,
        ready: false,
        table: '',
        items: {
          dishes: [],
          drinks: [],
        },
        comments: '',
      },
      comments: '',
    };
  };

  componentWillMount() {
    this.fetchMenu(this.props.match.params.uid);
    // VER SI SE PUEDE PASAR LOS VALIDADORES DE ORDEN A OTRA FUNCION Y NO EN EL MONTADO
    if(this.props.match.params.table !== "takeout") {
      this.tableIsValid(this.props.match.params.uid);
    }
    this.orderIsValid(this.props.match.params.uid);
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
        let table = this.props.match.params.table === "takeout" ? "takeout" : Number(this.props.match.params.table);

        this.setState({ 
          table,
          menu: newMenu, 
          dataFetched: true, 
          order: { ...this.state.order, table },
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
      if(fetchedOrders.current === 0) { fetchedOrders.current = [] };
      this.setState({ orderIsValid, fetchedOrders });
    })
  }

  getTakeoutOrder = (orders) => {
    let orderNum = 0;
    orders.current.forEach(el => {
      if(el.table === "takeout" && el.orderNum > orderNum) orderNum = el.orderNum;
    });

    orders.past.forEach(el => {
      if(el.table === "takeout" && el.orderNum > orderNum) orderNum = el.orderNum;
    });

    return orderNum + 1;
  }

  sendOrder = (uid) => {
    if(this.state.table !== "takeout") {
      if(this.state.tableIsValid === false) {
        this.setState({ error: "Check table number" });
        return;
      }
  
      if(this.state.orderIsValid === false) {
        this.setState({ error: "Order number is invalid" });
        return;
      }
    }

    let newOrders = {...this.state.fetchedOrders};
    let order = {
      ...this.state.order,
      items: {
        dishes: [...this.state.order.items.dishes],
        drinks: [...this.state.order.items.drinks],
      },
      start: new Date().getTime(),
    };
    order.comments = this.state.comments;

    console.log(order);

    if(this.state.table === "takeout") order.orderNum = this.getTakeoutOrder(newOrders);

    if(order.items.dishes.length === 0) {
      order.items.dishes = 0;
    }

    if(order.items.drinks.length === 0) {
      order.items.drinks = 0;
    }

    newOrders.current.push(order);
    this.props.firebase.userOrders(uid).set(newOrders);
    this.setState({ orderSent: true })
  }

  itemExistsInOrder = (name, type) => {
    let exists = this.state.order.items[type].find(item => item.name === name);
    return exists === undefined ? false : true;
  }

  addItem = (item, type) => {
    if(this.itemExistsInOrder(item.name, type)) return;
    let newOrder = {
      ...this.state.order,
      items: {
        dishes: [...this.state.order.items.dishes],
        drinks: [...this.state.order.items.drinks],
      }
    };

    newOrder.cost = newOrder.cost + this.getItemCost(item.name, type);
    newOrder.items[type].push({ name: item.name, qty: 1 });
    this.setState({ order: newOrder });
  }

  getItemCost = (name, type) => {
    return this.state.menu[type].find(el => el.name === name).price;
  };

  deleteItem = (item, type) => {
    let newOrder = {
      ...this.state.order,
      items: { 
        dishes: [...this.state.order.items.dishes], 
        drinks: [...this.state.order.items.drinks] ,
      }
    }
    newOrder.items[type] = newOrder.items[type].filter(el => el.name !== item.name);
    let itemCost = this.getItemCost(item.name, type) * item.qty;
    newOrder.cost = newOrder.cost - itemCost;
    this.setState({ order: newOrder });
  }

  upgradeItemQty = (name, type, qty) => {  
    let newOrder = { 
      ...this.state.order,
      items: {
        dishes: [...this.state.order.items.dishes],
        drinks: [...this.state.order.items.drinks],
      } 
    };
    let itemIndex = newOrder.items[type].findIndex(el => el.name === name);
    if(newOrder.items[type][itemIndex].qty === 1 && qty === -1) return;
    newOrder.items[type][itemIndex].qty = newOrder.items[type][itemIndex].qty + qty;
    let itemCost = this.getItemCost(name, type);
    if(qty === -1) {
      newOrder.cost = newOrder.cost - itemCost; 
    } else {
      newOrder.cost = newOrder.cost + itemCost;
    }
    this.setState({ order: newOrder });
  }

  render() {
    const orderIsEmpty = this.state.order.items.dishes.length === 0 && this.state.order.items.drinks.length === 0;
    const { dataFetched, order, orderSent } = this.state;
    const { drinks, dishes } = this.state.menu;
    const drinksIsEmpty = (drinks.length === 0 || drinks === 0 ) ? true : false;
    const dishesIsEmpty = (dishes.length === 0 || dishes === 0 ) ? true : false;
    const orderDrinksIsEmpty = order.items.drinks.length === 0 ? true : false;
    const orderDishesIsEmpty = order.items.dishes.length === 0 ? true : false;

    return (
      <div className="clientMenu"> 
        {!dataFetched && <h1>Menu</h1>}

        {!orderSent && (
          <>
            <h2 onClick={() => console.log(this.props.match.params)}>Table {this.state.table}</h2>
            <div className="menu">
              <div>
                <h4 onClick={() => console.log(this.state)}>Bebidas</h4> 
                {drinksIsEmpty ? 
                  <h3>No hay bebidas registradas</h3>
                :
                  <ol>
                    {drinks && drinks.map((item, idx) =>
                      <li key={idx} onClick={() => this.addItem(item, 'drinks')}>
                        <p>{item.name} - ${item.price}</p>
                        <p>{item.description}</p>
                      </li>
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
                      <li key={idx} onClick={() => this.addItem(item, 'dishes')}>
                        <p>{item.name} - ${item.price}</p>
                        <p>{item.description}</p>
                      </li>        
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
                <div>
                  <label>Extra instructions or request</label>
                  <textarea rows="4" cols="50" form="usrform"  onChange={(e) => this.setState({ comments: e.target.value  })}/>
                </div>
                <h3>Order cost: ${this.state.order.cost}</h3>
                <button disabled={orderIsEmpty} onClick={() => this.sendOrder(this.props.match.params.uid)}>TEST ORDER</button>
              </div>
            </div>
          </>
        )}

        {orderSent && (
          <>
            <h2>ORDER SENT!</h2>
            <p>Your total is: {order.cost}</p>
          </>
        )}

        {this.state.error && <p>{this.state.error}</p>}
      </div>
    );
  }
}

export default withFirebase(Menu);