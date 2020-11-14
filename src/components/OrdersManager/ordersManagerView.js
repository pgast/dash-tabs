import React, { useContext } from 'react';

import './style.css';
import { Store } from '../../store';
import { OrderCard } from '../Cards';
import OrdersSideboard from './ordersSideboard';

const OrdersManagerView = ({
  orders,
  getDate,
  orderReady,
  resetOrder,
  viewCurrent,
  deleteOrder,
  toggleViews,
  getTimeDate,
  getOrderTime,
  itemsAreValid,
  selectedOrder,
  pastOrdersValid,
  setSelectedOrder,
  currentOrdersValid,
}) => {
  const { state, dispatch } = useContext(Store);
  const updateSideboardState = (mode) => dispatch({ type: 'TOGGLE_SIDEBOARD', payload: mode });
  const toggleOrders = (value) => {
    toggleViews(value);
    updateSideboardState(false);
  }

  return (
    <div className={state.sideboardOpen ? "viewSmall" : "viewFull"}>
      <div className="dashboardHeader">
        <h1>ORDERS</h1>
        <div className="orderToggler">
          <h4 onClick={() => toggleOrders(true)} id={!viewCurrent && "unselected"}>CURRENT</h4>
          <h4 onClick={() => toggleOrders(false)} id={viewCurrent && "unselected"}>PAST</h4>
        </div>
      </div>
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
                  getTimeDate={getTimeDate}
                  highlight={idx <= 2 ? true : false}
                  setSelectedOrder={setSelectedOrder}
                  updateSideboardState={updateSideboardState}
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
              {orders.past.map((el, idx) => (
                <OrderCard 
                  el={el}
                  key={idx}
                  idx={idx}
                  isCurrent={false}
                  getTimeDate={getTimeDate}
                  setSelectedOrder={setSelectedOrder}
                  updateSideboardState={updateSideboardState}
                  isSelected={selectedOrder.index === idx ? true : false}
                />
              ))}
            </>
          :
            <h3>NO PAST ORDERS</h3>
        )}
      </div>
      <div className={selectedOrder.index === null ? "hidden" : "fixedSideboard"}>
        <OrdersSideboard 
          getDate={getDate}
          orderReady={orderReady}
          resetOrder={resetOrder}
          viewCurrent={viewCurrent}
          deleteOrder={deleteOrder}
          getOrderTime={getOrderTime}
          selectedOrder={selectedOrder} 
          itemsAreValid={itemsAreValid}
        />
      </div>
    </div>
  );
};

export default OrdersManagerView;