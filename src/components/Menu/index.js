import React, { Component } from 'react';
import MenuView from './menuView';

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
      showModal: false,
      confirmationScreen: false,
      currentItem: { type: null, idx: null }
    };
  };

  componentWillMount() {
    this.fetchMenu(this.props.match.params.uid);
    // VER SI SE PUEDE PASAR LOS VALIDADORES DE ORDEN A OTRA FUNCION Y NO EN EL MONTADO
    if(this.props.match.params.table !== "takeout") {
      this.tableIsValid(this.props.match.params.uid);
    }
    this.orderIsValid(this.props.match.params.uid);
    this.fetchRestaurantName(this.props.match.params.uid);
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  /* QUE NO EXISTA ESTA FUNCION, SE PUEDE JUNTAR CON OTRA */
  fetchRestaurantName = (uid) => {
    this.props.firebase.user(uid).on('value', snapshot => {
      let businessName = snapshot.val().businessName;
      this.setState({ businessName });
    });
  }

  /* NO CAMBIA CURRENT NI PAST ORDERS */
  fetchMenu = (uid) => {
    this.props.firebase.userMenu(uid).on('value', snapshot => {
      if(snapshot.val() !== null) {
        let newMenu = { drinks: 0, dishes: 0 };
        if(snapshot.val().dishes !== 0) newMenu.dishes = snapshot.val().dishes.filter(el => el.available);
        if(snapshot.val().drinks !== 0) newMenu.drinks = snapshot.val().drinks.filter(el => el.available);
        let table = this.props.match.params.table === "takeout" ? "takeout" : Number(this.props.match.params.table);

        let currentUser = this.props.firebase.getCurrentUser();

        this.setState({ 
          table,
          menu: newMenu, 
          dataFetched: true, 
          order: { ...this.state.order, table },
          showModal: currentUser === null ? false : currentUser.isAnonymous,
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
      if(fetchedOrders.current === 0) fetchedOrders.current = [];
      if(fetchedOrders.past === 0) fetchedOrders.past = [];
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

  sendOrder = () => {
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


    if(this.state.table === "takeout") {
      order.orderNum = this.getTakeoutOrder(newOrders);
    } 

    if(order.items.dishes.length === 0) order.items.dishes = 0;
    if(order.items.drinks.length === 0) order.items.drinks = 0;
    if(newOrders.past.length === 0) newOrders.past = 0;
    
    newOrders.current.push(order);
    this.props.firebase.userOrders(this.props.match.params.uid).set(newOrders);
    this.setState({ orderSent: true })
  }

  itemExistsInOrder = (name, type) => {
    let exists = this.state.order.items[type].find(item => item.name === name);
    return exists === undefined ? false : true;
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

  toggleModal = e => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  handleFormInput = input => {
    this.setState({
      comments: input
    });
  };


  // NEW ITEM HANDLERS
  setCurrentItem = (type, idx, item) => {
    // REVISAR SI NO ESTA EN LA ORDEN YA
    // SI SI ESTA, TOMAR ESOS VALORES Y AGREGARLOS A CURRENT STATE
    // SI NO, EMPEZAR DESDE 0


    this.setState({ currentItem: {
      idx,
      type,
      qty: 1,
      name: item.name,
      cost: item.price,
      subtotal: item.price,
    }});
  };

  upgradeItemQty = (qty) => {
    let newCurrentItem = {...this.state.currentItem};  
    if(qty === -1) {
      if(newCurrentItem.qty === 1) return;
      newCurrentItem.qty--;
    } else {
      newCurrentItem.qty++;
    }
    newCurrentItem.subtotal = newCurrentItem.cost * newCurrentItem.qty;
    this.setState({ currentItem: newCurrentItem });
  };

  addItem = () => {
    if(this.itemExistsInOrder(this.state.currentItem.name, this.state.currentItem.type)) return;
    let newOrder = {
      ...this.state.order,
      items: {
        dishes: [...this.state.order.items.dishes],
        drinks: [...this.state.order.items.drinks],
      }
    };

    newOrder.cost = newOrder.cost + this.state.currentItem.subtotal;
    newOrder.items[this.state.currentItem.type].push({ name: this.state.currentItem.name, qty: this.state.currentItem.qty });
    
    this.setState({ 
      order: newOrder,
      currentItem: { type: null, idx: null },
    });
  }

  render() {
    const {
      menu,
      table,
      error,
      order,
      showModal,
      orderSent,
      dataFetched,
      currentItem,
      businessName,
    } = this.state;

    const orderIsEmpty = order.items.dishes.length === 0 && order.items.drinks.length === 0;
    const drinksIsEmpty = (menu.drinks.length === 0 || menu.drinks === 0 ) ? true : false;
    const dishesIsEmpty = (menu.dishes.length === 0 || menu.dishes === 0 ) ? true : false;
    const orderDrinksIsEmpty = order.items.drinks.length === 0 ? true : false;
    const orderDishesIsEmpty = order.items.dishes.length === 0 ? true : false;

    return (
      <MenuView 
        error={error}
        table={table}
        drinks={menu.drinks}
        dishes={menu.dishes}
        orderSent={orderSent}
        showModal={showModal}
        addItem={this.addItem}
        order={this.state.order}
        currentItem={currentItem}
        dataFetched={dataFetched}
        sendOrder={this.sendOrder}
        orderIsEmpty={orderIsEmpty}
        businessName={businessName}
        deleteItem={this.deleteItem}
        drinksIsEmpty={drinksIsEmpty}
        dishesIsEmpty={dishesIsEmpty}
        toggleModal={this.toggleModal}
        setCurrentItem={this.setCurrentItem}
        upgradeItemQty={this.upgradeItemQty}
        handleFormInput={this.handleFormInput}
        orderDishesIsEmpty={orderDishesIsEmpty}
        orderDrinksIsEmpty={orderDrinksIsEmpty}
        itemExistsInOrder={this.itemExistsInOrder}
      />
    );
  }
}

export default withFirebase(Menu);