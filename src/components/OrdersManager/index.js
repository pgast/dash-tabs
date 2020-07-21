import React, { Component } from "react";

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
    if(!newOrders.past) newOrders.past = [];
    newOrders.past.push(selectedOrder);
    this.props.updateOrders(newOrders);
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
      if(!newOrders.current) newOrders.current = [];
      newOrders.current.push(selectedOrder);
      this.props.updateOrders(newOrders);
    } else {
      return;
    }


    // if(numIsInCurrent) {
    //   return;
    // } else {
    //   selectedOrder.ready = false;
    //   newOrders.past = newOrders.past.filter((el, idx) => idx !== index);
    //   if(newOrders.past.length === 0) newOrders.past = 0;
    //   if(!newOrders.current) newOrders.current = [];
    //   newOrders.current.push(selectedOrder);
    //   this.props.updateOrders(newOrders);
    // }
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
    let current = this.state.orders.current === 0 ? [] : [...this.state.orders.current];
    let past = this.state.orders.past === 0 ? [] : [...this.state.orders.past];
    let newOrders = { current, past }
    newOrders[type].splice(index, 1);
    this.props.updateOrders(newOrders);
  };

  render() {
    const currentOrdersValid = this.state.orders.current === 0 ? false : true;
    const pastOrdersValid = this.state.orders.past === 0 ? false : true;

    return (
      <>
        <h2 onClick={() => console.log(this.state)}>Orders Manager</h2>
        <h2 onClick={() => console.log(this.props.dbOrders)}>console log props</h2>
        <div className="viewToggler">
          <h4 onClick={() => this.toggleViews(true)}>CURRENT ORDERS</h4>
          <h4 onClick={() => this.toggleViews(false)}>PAST ORDERS</h4>
        </div>

        {this.state.viewCurrent && (
          currentOrdersValid ? 
            <>
              <h3>CURRENT ORDERS LOG:</h3>
              <ol>
                {this.state.orders.current.map((el, idx) => (
                  <li className="orderCard" key={idx}>
                    <div className="info">
                      <p>Cost: {el.cost}</p>
                      <p>{el.table === "takeout" ? `Takeout order: ${el.orderNum}` : el.table}</p>
                      <p>Order start: {this.getDate(el.start)}</p>
                    </div>
                    <div className="items">
                      {
                        this.state.showItems === idx ?
                        <>
                          {this.itemsAreValid(el.items.dishes) ?
                            <>
                              <p>DISHES</p>
                              <ol>
                                {el.items.dishes.map((item, index) => (
                                  <li key={index}>{item.name} - Qty: {item.qty}</li>
                                ))}
                              </ol>
                            </>
                            :
                            null
                          }

                          {this.itemsAreValid(el.items.drinks) ?
                            <>
                              <p>DRINKS</p>
                              <ol>
                                {el.items.drinks.map((item, index) => (
                                  <li key={index}>{item.name} - Qty: {item.qty}</li>
                                ))}
                              </ol>
                            </>
                            :
                            null
                          }
                          <button onClick={this.toggleItems}>Close</button>
                        </>
                        :
                        <>
                          <button onClick={() => this.toggleItems(idx)}>Show Items</button>
                          <button onClick={() => this.orderReady(idx)}>Order Completed</button>
                          <button onClick={() => this.deleteOrder(idx, 'current')}>DELETE ORDER</button>
                        </>
                      }
                    </div>
                  </li>
                ))}
              </ol>
            </>
          :  
            <h3>NO CURRENT ORDERS</h3>
        )}


        {!this.state.viewCurrent && (
          pastOrdersValid ? 
            <>
              <h3>PAST ORDERS LOG:</h3>
              <ol>
                {this.state.orders.past.map((el, idx) => (
                  <li className="orderCard" key={idx}>
                    <div className="info">
                      <p>Cost: {el.cost}</p>
                      <p>{el.table === "takeout" ? `Takeout order: ${el.orderNum}` : el.table}</p>
                      <p>Order start: {this.getDate(el.start)}</p>
                      <p>Order end: {this.getDate(el.end)}</p>
                      <p>Order completion in: {this.getOrderTime(el.start, el.end)}</p>
                    </div>
                    <div className="items">
                      {
                          this.state.showItems === idx ?
                          <>
                            {this.itemsAreValid(el.items.dishes) ? 
                              <>
                                <p>DISHES</p>
                                <ol>
                                  {el.items.dishes.map((item, index) => (
                                    <li key={index}>{item.name} - Qty: {item.qty}</li>
                                  ))}
                                </ol>
                              </>
                              :
                              null
                            }
                            
                            {this.itemsAreValid(el.items.drinks) ?
                              <>
                                <p>DRINKS</p>
                                <ol>
                                  {el.items.drinks.map((item, index) => (
                                    <li key={index}>{item.name} - Qty: {item.qty}</li>
                                  ))}
                                </ol>
                              </>
                              :
                              null
                            }

                            <button onClick={this.toggleItems}>Close</button>
                          </>
                          :
                          <>
                            <button onClick={() => this.resetOrder(idx)}>Reset Order</button>
                            <button onClick={() => this.toggleItems(idx)}>Show Items</button>
                            <button onClick={() => this.deleteOrder(idx, 'past')}>DELETE ORDER</button>
                          </>
                        }
                    </div>
                  </li>
                ))}
              </ol>
            </>
          :
            <h3>NO PAST ORDERS</h3>
        )}
      </>
    )
  }
}

export default OrdersManager;



    {/* ORDEN
      {
        items: { 
          drinks: [{ item: 'corona', qty: 23 }], 
          dishes: [{ item: 'burger', qty: 1, notes: 'no sauce' }] 
        },
        cost: 452,  <== que hacer aqui si se modifica la orden, vuelve a hacerse costeo?
        table: 45 / "takeout"
        ready: "ongoing" / "ready" 
        start: 23/junio/2020 23:12 <== solo agregar hora
        end: 23/junio/2020 23:34 <== solo agregar hora 
      }
    */}