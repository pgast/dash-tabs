import React, { Component } from "react";
import OrdersManagerView from './ordersManagerView';

class OrdersManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: { current: [], past: [] },
      viewCurrent: true,
      showItems: false,
    }
  }

  componentDidMount() {
    this.setState({ orders: this.props.dbOrders });
  }

  componentDidUpdate(prevProps) {
    if(this.props.dbOrders !== prevProps.dbOrders) {
      this.setState({ orders: this.props.dbOrders });
    }
  }

  toggleViews = (input) => {
    this.setState({ viewCurrent: input, showItems: false })
  }

  toggleItems = (idx=false) => {
    this.setState({ showItems: idx })
  }

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
    this.props.updateOrdersDb(newOrders);
  }

  resetOrder= (index) => {
    let current = this.state.orders.current === 0 ? [] : [...this.state.orders.current];
    let past = [...this.state.orders.past];
    let newOrders = { current, past }
    let selectedOrder = newOrders.past[index];

    let tableNum = past[index].table;
    let numIsInCurrent = current.find(el => el.table === tableNum) === undefined ? false : true;

    if(!numIsInCurrent || tableNum === "takeout") {
      selectedOrder.ready = false;
      newOrders.past = newOrders.past.filter((el, idx) => idx !== index);
      if(newOrders.past.length === 0) newOrders.past = 0;
      // if(!newOrders.current) newOrders.current = [];
      newOrders.current.push(selectedOrder);
      this.props.updateOrdersDb(newOrders);
    } else {
      return;
    }
  }

  itemsAreValid = (items) => items === 0 ? false : true;

  getDate = (mils) => { 
    let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let date = new Date(mils);
    return `${days[date.getDay()]} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}` 
  }

  getOrderTime = (start, end) => {
    let minutes = ((end-start)/1000)/60;
    minutes = Math.round(minutes * 100) / 100;
    return `${minutes} ${minutes < 10 ? 'minute':'minutes'}`;
  }

  deleteOrder = (index, type) => {
    let current = this.state.orders.current === 0 ? 0 : [...this.state.orders.current];
    let past = this.state.orders.past === 0 ? 0 : [...this.state.orders.past];
    let newOrders = { current, past }
    newOrders[type].splice(index, 1);

    if(newOrders.current.length === 0) newOrders.current = 0;
    if(newOrders.past.length === 0) newOrders.past = 0;
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
        toggleItems={this.toggleItems}
        deleteOrder={this.deleteOrder}
        getOrderTime={this.getOrderTime}
        showItems={this.state.showItems}
        pastOrdersValid={pastOrdersValid}
        itemsAreValid={this.itemsAreValid}
        viewCurrent={this.state.viewCurrent}
        currentOrdersValid={currentOrdersValid}
      />
    )
  }
}

export default OrdersManager;