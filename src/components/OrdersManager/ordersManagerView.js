import React from 'react';

const OrdersManagerView = ({
  orders,
  getDate,
  showItems,
  orderReady,
  resetOrder,
  viewCurrent,
  deleteOrder,
  toggleViews,
  toggleItems,
  getOrderTime,
  itemsAreValid,
  pastOrdersValid,
  currentOrdersValid,
}) => (
  <>
    <h2>Orders Manager</h2>
    <div className="viewToggler">
      <h4 onClick={() => toggleViews(true)}>CURRENT ORDERS</h4>
      <h4 onClick={() => toggleViews(false)}>PAST ORDERS</h4>
    </div>

    {viewCurrent && (
      currentOrdersValid ? 
        <>
          <h3>CURRENT ORDERS LOG:</h3>
          <ol>
            {orders.current.map((el, idx) => (
              <li className="orderCard" key={idx}>
                <div className="info">
                  <p>Cost: {el.cost}</p>
                  <p>{el.table === "takeout" ? `Takeout order: ${el.orderNum}` : el.table}</p>
                  <p>Order start: {getDate(el.start)}</p>
                </div>
                <div className="items">
                  {
                    showItems === idx &&
                    <>
                      {itemsAreValid(el.items.dishes) ?
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

                      {itemsAreValid(el.items.drinks) ?
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
                      <div>
                        <p>Comments</p>
                        <p>{el.comments}</p>
                      </div>
                      <button onClick={toggleItems}>Close</button>
                    </>
                  }


                  {showItems !== idx && 
                    <>
                      <button onClick={() => toggleItems(idx)}>Show Items</button>
                      <button onClick={() => orderReady(idx)}>Order Completed</button>
                      <button onClick={() => deleteOrder(idx, 'current')}>DELETE ORDER</button>
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


    {!viewCurrent && (
      pastOrdersValid ? 
        <>
          <h3>PAST ORDERS LOG:</h3>
          <ol>
            {orders.past.map((el, idx) => (
              <li className="orderCard" key={idx}>
                <div className="info">
                  <p>Cost: {el.cost}</p>
                  <p>{el.table === "takeout" ? `Takeout order: ${el.orderNum}` : el.table}</p>
                  <p>Order start: {getDate(el.start)}</p>
                  <p>Order end: {getDate(el.end)}</p>
                  <p>Order completion in: {getOrderTime(el.start, el.end)}</p>
                </div>
                <div className="items">
                  {
                      showItems === idx ?
                      <>
                        {itemsAreValid(el.items.dishes) ? 
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
                        
                        {itemsAreValid(el.items.drinks) ?
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
                          <div>
                          <p>Comments</p>
                          <p>{el.comments}</p>
                        </div>
                        <button onClick={toggleItems}>Close</button>
                      </>
                      :
                      <>
                        <button onClick={() => resetOrder(idx)}>Reset Order</button>
                        <button onClick={() => toggleItems(idx)}>Show Items</button>
                        <button onClick={() => deleteOrder(idx, 'past')}>DELETE ORDER</button>
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
);

export default OrdersManagerView;