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
      confirmScreen: false,
      currentItem: { type: null, idx: null }
    };
  };

  componentWillMount() {
    this.fetchMenu(this.props.match.params.uid);
    if(this.props.match.params.table !== "takeout") {
      this.tableIsValid(this.props.match.params.uid);
    }
    this.orderIsValid(this.props.match.params.uid);
    this.fetchRestaurantName(this.props.match.params.uid);
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  fetchRestaurantName = (uid) => {
    this.props.firebase.user(uid).on('value', snapshot => {
      let businessName = snapshot.val().businessName.toUpperCase();
      this.setState({ businessName });
    });
  }

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
        this.setState({ error: "ERROR FETCHING ITEMS FROM MENU" });
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
        this.setState({ error: "CHECK TABLE NUMBER" });
        return;
      }
      if(this.state.orderIsValid === false) {
        this.setState({ error: "ORDER NUMBER IS INVALID" });
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

  getItemQty = (name, type) => {
    let foundItem = this.state.order.items[type].find(item => item.name === name);
    return foundItem.qty;
  }

  getItemCost = (name, type) => this.state.menu[type].find(el => el.name === name).price;

  deleteItem = (item, type) => {
    let newOrder = {
      ...this.state.order,
      items: { 
        dishes: [...this.state.order.items.dishes], 
        drinks: [...this.state.order.items.drinks],
      }
    };
    let foundItem = this.state.order.items[type].find(it => it.name === item.name);
    let itemSubtotal = this.getItemCost(item.name, type) * foundItem.qty;
    newOrder.items[type] = newOrder.items[type].filter(el => el.name !== item.name);
    newOrder.cost = newOrder.cost - itemSubtotal;
    this.setState({ order: newOrder, currentItem: { type: null, idx: null } });
  };

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

  toggleConfirmScreen = () => {
    window.scrollTo(0,0); 
    this.setState({
      confirmScreen: !this.state.confirmScreen
    });
  };

  setCurrentItem = (type, idx, item) => {
    if(this.itemExistsInOrder(item.name, type)) {
      let foundItem = this.state.order.items[type].find(it => it.name === item.name);
      this.setState({ currentItem: {
        idx,
        type,
        qty: foundItem.qty,
        name: foundItem.name,
        cost: this.getItemCost(item.name, type),
        subTotal: foundItem.qty * this.getItemCost(item.name, type),
      }});

    } else {
      this.setState({ currentItem: {
        idx,
        type,
        qty: 1,
        name: item.name,
        cost: item.price,
        subtotal: item.price,
      }});
    };
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
    let { order, currentItem } = this.state;
    let newOrder = { ...order, items: { dishes: [...order.items.dishes], drinks: [...order.items.drinks] } };
    if(this.itemExistsInOrder(currentItem.name, currentItem.type)) {
      let foundItemIdx = newOrder.items[currentItem.type].findIndex(el => el.name === currentItem.name);
      let prevItemSubtotal = newOrder.items[currentItem.type][foundItemIdx].qty * this.getItemCost(currentItem.name, currentItem.type);
      let newItemSubtotal = currentItem.qty * this.getItemCost(currentItem.name, currentItem.type);
      newOrder.items[currentItem.type][foundItemIdx].qty = currentItem.qty;
      if(newItemSubtotal > prevItemSubtotal) {
        newOrder.cost = newOrder.cost + (newItemSubtotal - prevItemSubtotal);
      }
      if(newItemSubtotal < prevItemSubtotal) {
        newOrder.cost = newOrder.cost - (prevItemSubtotal - newItemSubtotal);
      }
    } else {
      newOrder.items[currentItem.type].push({ name: currentItem.name, qty: currentItem.qty });
      newOrder.cost = newOrder.cost + currentItem.subtotal;
    }
    this.setState({ order: newOrder, currentItem: { type: null, idx: null }});
  };

  render() {
    const {
      menu,
      error,
      order,
      showModal,
      orderSent,
      dataFetched,
      currentItem,
      businessName,
      confirmScreen,
    } = this.state;

    const orderIsEmpty = order.items.dishes.length === 0 && order.items.drinks.length === 0;
    const drinksIsEmpty = (menu.drinks.length === 0 || menu.drinks === 0 ) ? true : false;
    const dishesIsEmpty = (menu.dishes.length === 0 || menu.dishes === 0 ) ? true : false;
    const orderDrinksIsEmpty = order.items.drinks.length === 0 ? true : false;
    const orderDishesIsEmpty = order.items.dishes.length === 0 ? true : false;

    return (
      <MenuView 
        error={error}
        order={order}
        drinks={menu.drinks}
        dishes={menu.dishes}
        orderSent={orderSent}
        showModal={showModal}
        addItem={this.addItem}
        currentItem={currentItem}
        dataFetched={dataFetched}
        sendOrder={this.sendOrder}
        orderIsEmpty={orderIsEmpty}
        businessName={businessName}
        deleteItem={this.deleteItem}
        getItemQty={this.getItemQty}
        drinksIsEmpty={drinksIsEmpty}
        dishesIsEmpty={dishesIsEmpty}
        confirmScreen={confirmScreen}
        toggleModal={this.toggleModal}
        getItemCost={this.getItemCost}
        setCurrentItem={this.setCurrentItem}
        upgradeItemQty={this.upgradeItemQty}
        handleFormInput={this.handleFormInput}
        orderDishesIsEmpty={orderDishesIsEmpty}
        orderDrinksIsEmpty={orderDrinksIsEmpty}
        itemExistsInOrder={this.itemExistsInOrder}
        toggleConfirmScreen={this.toggleConfirmScreen}
      />
    );
  }
}

export default withFirebase(Menu);