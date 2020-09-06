import React from 'react';
import OrdersSideboard from './ordersSideboard';
import { OrderCard } from '../Cards';
import './style.css';

const OrdersManagerView = ({
  orders,
  getDate,
  orderReady,
  resetOrder,
  viewCurrent,
  deleteOrder,
  toggleViews,
  getOrderTime,
  itemsAreValid,
  selectedOrder,
  pastOrdersValid,
  setSelectedOrder,
  currentOrdersValid,
}) => (
  <div className="orders">
    <div className="dashboardHeader">
      <h1 onClick={() => console.log(orders)}>ORDERS</h1>
      <div className="orderToggler">
        <h4 onClick={() => toggleViews(true)}>CURRENT</h4>
        <h4 onClick={() => toggleViews(false)}>PAST</h4>
      </div>
    </div>
    <div className="view">
      <div className="ordersCardsView">
        {viewCurrent && (
          currentOrdersValid ? 
            <>
              {orders.current.map((el, idx) => (
                <OrderCard 
                  el={el}
                  key={idx}
                  idx={idx}
                  isCurrent
                  getDate={getDate}
                  highlight={idx <= 2 ? true : false}
                  setSelectedOrder={setSelectedOrder}
                  isSelected={selectedOrder.index === idx ? true : false}
                />
              ))}
            </>
          :  
            <h3>NO CURRENT ORDERS</h3>
        )}
        {!viewCurrent && (
          pastOrdersValid ? 
            <>
              <h3>PAST ORDERS LOG:</h3>
              <>
                {orders.past.map((el, idx) => (
                  <OrderCard 
                    el={el}
                    idx={idx}
                    isCurrent={false}
                    setSelectedOrder={setSelectedOrder}
                    isSelected={selectedOrder.index === idx ? true : false}
                  />
                ))}
              </>
            </>
          :
            <h3>NO PAST ORDERS</h3>
        )}
      </div>
      <div className="fixedSideboard" style={ {display: selectedOrder.index === null && 'none' }}>
        <OrdersSideboard 
          getDate={getDate}
          orderReady={orderReady}
          resetOrder={resetOrder}
          viewCurrent={viewCurrent}
          deleteOrder={deleteOrder}
          selectedOrder={selectedOrder} 
          itemsAreValid={itemsAreValid}
        />
      </div>
    </div>
  </div>
);

export default OrdersManagerView;