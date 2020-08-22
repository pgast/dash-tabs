import React from 'react';
import Modal from '../Modal';

const MenuView = ({
  error,
  table,
  order,
  drinks,
  dishes,
  addItem,
  showModal,
  sendOrder,
  orderSent,
  deleteItem,
  toggleModal,
  dataFetched,
  orderIsEmpty,
  businessName,
  drinksIsEmpty,
  dishesIsEmpty,
  upgradeItemQty,
  handleFormInput,
  orderDishesIsEmpty,
  orderDrinksIsEmpty,
}) => (
  <div className="clientMenu"> 
    {!dataFetched && <h1>Menu</h1>}

    {!orderSent && (
      <>
        <h1>Welcome to {businessName}</h1>
        <h2>Table {table}</h2>
        <div className="menu">
          <div>
            <h4>Bebidas</h4> 
            {drinksIsEmpty ? 
              <h3>No hay bebidas registradas</h3>
            :
              <ol>
                {drinks && drinks.map((item, idx) =>
                  <li key={idx} onClick={() => addItem(item, 'drinks')}>
                    <p>{item.name} - ${item.price}</p>
                    <p>{item.description}</p>
                  </li>
                )}
              </ol>
            }
          </div>
          <div>
            <h4>Comidas</h4>
            {dishesIsEmpty ? 
              <h3>No hay comidas registradas</h3>
            :
              <ol>
                {dishes && dishes.map((item, idx) => 
                  <li key={idx} onClick={() => addItem(item, 'dishes')}>
                    <p>{item.name} - ${item.price}</p>
                    <p>{item.description}</p>
                  </li>        
                )}
              </ol>
            }
          </div>
        </div>

        <div className="clientMenu_orderForm">
          <div>
            <div>
              {!orderDrinksIsEmpty && (
                <>
                  <h4>Drinks</h4>
                  <ul>
                    {order.items.drinks.map((item, idx) => 
                      <li key={idx}>
                        <div>
                          {item.name} - x {item.qty}
                        </div>
                        <div id="itemQty">
                          <div>
                            <button onClick={() => upgradeItemQty(item.name, 'drinks', 1)}>+</button>
                          </div>
                          <div>
                            <button onClick={() => upgradeItemQty(item.name, 'drinks', -1)}>-</button>
                          </div>
                        </div>
                        <button onClick={() => deleteItem(item, 'drinks')}>X</button>
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
            <div>
              {!orderDishesIsEmpty && (
                <>
                  <h4>Dishes</h4>
                  <ul>
                    {order.items.dishes.map((item, idx) => 
                      <li key={idx}>
                        <div>
                          {item.name} - x {item.qty}
                        </div>
                        <div id="itemQty">
                          <div>
                            <button onClick={() => upgradeItemQty(item.name, 'dishes', 1)}>+</button>
                          </div>
                          <div>
                            <button onClick={() => upgradeItemQty(item.name, 'dishes', -1)}>-</button>
                          </div>
                        </div>
                        <button onClick={() => deleteItem(item, 'dishes')}>X</button>
                      </li>
                    )}
                  </ul>
                </>
              )}
            </div>
          </div>
          <hr />
          <div>
            <div>
              <label>Extra instructions or request</label>
              <textarea rows="4" cols="50" form="usrform"  onChange={(e) =>  handleFormInput(e.target.value)}/>
            </div>
            <h3>Order cost: ${order.cost}</h3>
            <button disabled={orderIsEmpty} onClick={() => sendOrder()}>TEST ORDER</button>
          </div>
        </div>
      </>
    )}

    {orderSent && (
      <>
        <h2>ORDER SENT!</h2>
        <p>Your total is: {order.cost}</p>
      </>
    )}

    <Modal toggleModal={toggleModal} show={showModal}>
      Message in Modal
    </Modal>

    {error && <p>{error}</p>}
  </div>
);

export default MenuView;