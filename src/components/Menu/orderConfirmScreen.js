import React from 'react';
import './style.css';

const OrderConfirmScreen = ({order, handleFormInput}) => (
  <div className="orderConfirmScreen">
    <h4>
      CONFIRM SCREEN
    </h4>
    <div className="clientMenu_orderForm">          
      <div>
        <div>
          <label>Extra instructions or request</label>
          <textarea rows="4" cols="50" form="usrform" onChange={(e) =>  handleFormInput(e.target.value)}/>
        </div>
      </div>
    </div>
  </div>
);

export default OrderConfirmScreen;