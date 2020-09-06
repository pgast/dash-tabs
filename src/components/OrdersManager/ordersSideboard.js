import React from 'react';

const OrdersSideboard = ({ 
  getDate, 
  resetOrder,
  orderReady,
  viewCurrent, 
  deleteOrder,
  itemsAreValid, 
  selectedOrder, 
}) => {
  return (
    <div className={selectedOrder.table === null ? "hidden" : "ordersSideboard"}>
      <div className="orderSideboard_view">
        <h1 onClick={() => console.log(selectedOrder)}>ORDER</h1>
        <p>{selectedOrder.table === "takeout" ? `Takeout order: ${selectedOrder.orderNum}` : `Table: ${selectedOrder.table}`}</p>
        <h4>Comments - {selectedOrder.comments}</h4>
        <p>Order start: {getDate(selectedOrder.start)}</p>

        {itemsAreValid(selectedOrder.dishes) && (
          <>
            <p>DISHES</p>
            <ol>
              {selectedOrder.dishes.map((item, index) => (
                <li key={index}>{item.name} - Qty: {item.qty}</li>
              ))}
            </ol>
          </>
        )}

        {itemsAreValid(selectedOrder.drinks) && (
          <>
            <p>DRINKS</p>
            <ol>
              {selectedOrder.drinks.map((item, index) => (
                <li key={index}>{item.name} - Qty: {item.qty}</li>
              ))}
            </ol>
          </>
        )}
      </div>

      <div className="ordersSideboard_actionButtons">
        {viewCurrent ? (
          <>
            <button onClick={() => orderReady(selectedOrder.index)}>COMPLETE ORDER</button>
            <button onClick={() => deleteOrder(selectedOrder.index, 'current')}>DELETE ORDER</button>
          </>
        ):(
          <>
            <button onClick={() => resetOrder(selectedOrder.index)}>RESET ORDER</button>
            <button onClick={() => deleteOrder(selectedOrder.index, 'past')}>DELETE ORDER</button>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersSideboard;