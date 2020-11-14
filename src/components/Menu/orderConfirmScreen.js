import React from 'react';

import './style.css';

const OrderConfirmScreen = ({
  order, 
  getItemCost,
  handleFormInput,
  orderDrinksIsEmpty,
  orderDishesIsEmpty, 
  toggleConfirmScreen
}) => (
  <div className="orderConfirmScreen">
    {!orderDrinksIsEmpty && (
      <div>
        <h4>Drinks</h4>
        {order.items.drinks.map((item, idx) => 
          <div key={idx} className="orderItem">
            <div>{item.name}</div>
            <div>
              <div>x {item.qty}</div>
              <div>${getItemCost(item.name, "drinks")} ea.</div>
            </div>
          </div>
        )}
      </div>
    )}
    {!orderDishesIsEmpty && (
      <div>
        <h4>Dishes</h4>
        {order.items.dishes.map((item, idx) => 
          <div key={idx} className="orderItem">
            <div>{item.name}</div>
            <div>
              <div>x {item.qty}</div>
              <div>${getItemCost(item.name, "dishes")} ea.</div>
            </div>
          </div>
        )}
      </div>
    )}
    <div>          
      <h4>Extra instructions or request</h4>
      <textarea rows="4" cols="50" form="usrform" onChange={(e) =>  handleFormInput(e.target.value)}/>
    </div>
    <div className="btn btn_secondary" onClick={() => toggleConfirmScreen()}>CANCEL</div>
  </div>
);

export default OrderConfirmScreen;