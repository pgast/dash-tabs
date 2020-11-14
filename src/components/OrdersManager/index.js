import React, { Component } from "react";

import OrdersManagerView from './ordersManagerView';

class OrdersManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: { current: [], past: [] },
      viewCurrent: true,
      selectedOrder: {
        index: null,
        cost: null,
        start: null,
        table: null,
        dishes: null,
        drinks: null,
        orderNum: null,
        comments: null,
      },
    }
  }

  componentDidMount() {
    this.setState({ orders: this.sortOrdersByTime(this.props.dbOrders) });
  }

  componentDidUpdate(prevProps) {
    if(this.props.dbOrders !== prevProps.dbOrders) {
      this.setState({ orders: this.sortOrdersByTime(this.props.dbOrders) });
    }
  }

  sortOrdersByTime = (orders) => {
    var sortedOrders = {...orders}; 
    if(sortedOrders.current !== 0) {
      sortedOrders.current = sortedOrders.current.slice().sort((a,b) => b.start - a.start);
    }
    if(sortedOrders.past !== 0) {
      sortedOrders.past = sortedOrders.past.slice().sort((a,b) => b.start - a.start); 
    }
    return sortedOrders;
  }

  toggleViews = (input) => {
    this.setState({ 
      viewCurrent: input, 
      selectedOrder: { 
        ...this.state.selectedOrder, 
        table: null, 
        index: null 
      }});
  };

  setSelectedOrder = (el, idx) => {
    this.setState({ selectedOrder: {
      index: idx,
      cost: el.cost,
      start: el.start,
      table: el.table,
      orderNum: el.orderNum,
      comments: el.comments,
      dishes: el.items.dishes,
      drinks: el.items.drinks,
      end: el.end ? el.end : null,
    }});
  };

  orderReady = (index) => {
    let current = [...this.state.orders.current];
    let past = this.state.orders.past === 0 ? [] : [...this.state.orders.past];
    let newOrders = { current, past };
    let selectedOrder = newOrders.current[index];
    selectedOrder.ready = true;
    selectedOrder.end = new Date().getTime();
    newOrders.current = newOrders.current.filter((el, idx) => idx !== index);
    if(newOrders.current.length === 0) newOrders.current = 0;
    newOrders.past.push(selectedOrder);
    this.setState({ 
      selectedOrder: {
        ...this.state.selectedOrder, 
        table: null, 
        index: null
      }
    });
    this.props.updateOrdersDb(newOrders);
  }

  resetOrder= (index) => {
    let current = this.state.orders.current === 0 ? [] : [...this.state.orders.current];
    let past = [...this.state.orders.past];
    let newOrders = { current, past }
    let selectedOrder = newOrders.past[index];

    let tableNum = past[index].table;
    let numIsInCurrent = current.find(el => el.table === tableNum) === undefined ? false : true;

    // check if selected order number is in current tables
    if(!numIsInCurrent || tableNum === "takeout") {
      selectedOrder.ready = false;
      selectedOrder.end = null;

      newOrders.past = newOrders.past.filter((el, idx) => idx !== index);
      if(newOrders.past.length === 0) newOrders.past = 0;
      newOrders.current.push(selectedOrder);
      this.setState({ 
        selectedOrder: {
          ...this.state.selectedOrder, 
          table: null, 
          index: null} 
        });
      this.props.updateOrdersDb(newOrders);
    } else {
      return;
    }
  }

  itemsAreValid = (items) => (items === 0 || items === null) ? false : true;

  getTimeDate = (mils) => {
    let date = new Date(mils);
    let minutes = date.getMinutes() + '';
    if(minutes.length === 1) minutes = "0" + minutes;
    return `${date.getHours()}:${minutes}`
  }

  getDate = (mils) => { 
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let date = new Date(mils);
    return { 
      completeDate: `${this.getTimeDate(mils)} - ${days[date.getDay()]} ${date.getDate()}`, 
      time: this.getTimeDate(mils) 
    };
  }

  getOrderTime = (start, end) => {
    let minutes = ((end-start)/1000)/60;
    minutes = Math.round(Math.round(minutes * 100) / 100);
    return `${minutes} ${minutes < 10 ? 'minute':'minutes'}`;
  }

  deleteOrder = (index, type) => {
    let current = this.state.orders.current === 0 ? 0 : [...this.state.orders.current];
    let past = this.state.orders.past === 0 ? 0 : [...this.state.orders.past];
    let newOrders = { current, past }
    newOrders[type].splice(index, 1);

    if(newOrders.current.length === 0) newOrders.current = 0;
    if(newOrders.past.length === 0) newOrders.past = 0;
    this.setState({ selectedOrder: {
      ...this.state.selectedOrder, 
      table: null, 
      index: null 
      } 
    })
    this.props.updateOrdersDb(newOrders);
  };

  render() {
    const currentOrdersValid = this.state.orders.current === 0 ? false : true;
    const pastOrdersValid = this.state.orders.past === 0 ? false : true;

    return (
      <OrdersManagerView 
        getDate={this.getDate}
        orders={this.state.orders}
        orderReady={this.orderReady}
        resetOrder={this.resetOrder}
        toggleViews={this.toggleViews}
        getTimeDate={this.getTimeDate}
        deleteOrder={this.deleteOrder}
        getOrderTime={this.getOrderTime}
        pastOrdersValid={pastOrdersValid}
        itemsAreValid={this.itemsAreValid}
        viewCurrent={this.state.viewCurrent}
        currentOrdersValid={currentOrdersValid}
        setSelectedOrder={this.setSelectedOrder}
        selectedOrder={this.state.selectedOrder}
      />
    );
  };
};

export default OrdersManager;