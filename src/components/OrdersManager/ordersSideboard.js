import React from 'react';

const OrdersSideboard = ({ 
  getDate, 
  resetOrder,
  orderReady,
  viewCurrent, 
  deleteOrder,
  getOrderTime,
  itemsAreValid, 
  selectedOrder, 
}) => {
  return (
    <div className="ordersSideboard">  
      <div className="ordersSideboard_view">
        <div className="ordersSideboard_view_header">
          <div className="order_title">
            {selectedOrder.orderNum !== undefined && <h3>ORDER #{selectedOrder.orderNum}</h3>}
            <h3>{selectedOrder.table === "takeout" ? `TAKEOUT` : `TABLE ${selectedOrder.table}`}</h3>
          </div>
          <div className="order_info">
            <h3>Start</h3>
            <h3 id="time">{getDate(selectedOrder.start).completeDate}</h3>
          </div>
          {selectedOrder.end && (
            <>
              <div className="order_info">
                <h3>End</h3>
                <h3 id="time">{getDate(selectedOrder.end).time}</h3>
              </div>
              <div className="order_info">
                <h3>Duration</h3>
                <h3 id="time">{getOrderTime(selectedOrder.start, selectedOrder.end)}</h3>
              </div>
            </>
          )}
          {selectedOrder.comments !== '' && (
            <div className="order_info">
              <h3>Comments</h3>
              <h3 id="time">{selectedOrder.comments}</h3>
            </div>
          )}
        </div>
        <div className="ordersSideboard_view_items">
          {itemsAreValid(selectedOrder.dishes) && (
            <div className="order_items">
              <h3>Dishes</h3>
              {selectedOrder.dishes.map((item, index) => (
                <div className="item_dish" key={index}>
                  <h4>- {item.name}</h4>
                  <h4>x{item.qty}</h4>
                </div>
              ))}
            </div>
          )}
          {itemsAreValid(selectedOrder.drinks) && (
            <div className="order_items">
              <h3>Drinks</h3>
              {selectedOrder.drinks.map((item, index) => (
                <div className="item_dish" key={index}>
                  <h4>- {item.name}</h4>
                  <h4>x{item.qty}</h4>
                </div>
              ))}
            </div>
          )}
        </div>
        <div id="total">
          <h3>Total</h3>
          <h3>${selectedOrder.cost}</h3>
        </div>
      </div>
      <div className="ordersSideboard_actionButtons">
        {viewCurrent ? (
          <>
            <div 
              className="btn"
              onClick={() => orderReady(selectedOrder.index)} 
            >
              ORDER DONE
            </div>
            <div 
              className="btn btn_secondary"
              onClick={() => deleteOrder(selectedOrder.index, 'current')} 
            >
              DELETE
            </div>
          </>
        ):(
          <>
            <div 
              className="btn"
              onClick={() => resetOrder(selectedOrder.index)} 
            >
              RESET
            </div>
            <div 
              className="btn btn_secondary"
              onClick={() => deleteOrder(selectedOrder.index, 'past')} 
            >
              DELETE
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersSideboard;