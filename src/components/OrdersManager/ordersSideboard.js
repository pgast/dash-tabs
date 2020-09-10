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
      <div className="ordersSideboard_view">
        <div className="ordersSideboard_view_header">
          <h1 onClick={() => console.log(selectedOrder)}>ORDER</h1>
          <p>{selectedOrder.table === "takeout" ? `Takeout order: ${selectedOrder.orderNum}` : `Table: ${selectedOrder.table}`}</p>
          <h4>Comments - {selectedOrder.comments}</h4>
          <p>Order start: {getDate(selectedOrder.start)}</p>
        </div>
        <div className="ordersSideboard_view_items">
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
      </div>

      <div className="ordersSideboard_actionButtons">
        {viewCurrent ? (
          <>
            <div 
              className="btn"
              onClick={() => orderReady(selectedOrder.index)} 
            >
              COMPLETE ORDER
            </div>
            <div 
              className="btn"
              onClick={() => deleteOrder(selectedOrder.index, 'current')} 
            >
              DELETE ORDER
            </div>
          </>
        ):(
          <>
            <div 
              className="btn"
              onClick={() => resetOrder(selectedOrder.index)} 
            >
              RESET ORDER
            </div>
            <div 
              className="btn"
              onClick={() => deleteOrder(selectedOrder.index, 'past')} 
            >
              DELETE ORDER
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersSideboard;