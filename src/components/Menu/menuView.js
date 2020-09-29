import React from 'react';
import Modal from '../Modals';
import { ClientMenuItemCard } from '../Cards';
import MenuDemoModal from '../Modals/MenuDemoModal';
import './style.css'

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
  currentItem,
  toggleModal,
  dataFetched,
  orderIsEmpty,
  businessName,
  drinksIsEmpty,
  dishesIsEmpty,
  setCurrentItem,
  upgradeItemQty,
  handleFormInput,
  itemExistsInOrder,
  orderDishesIsEmpty,
  orderDrinksIsEmpty,
}) => (
  <div className="menuView"> 
    {/* FETCHING DATA SCREEN */}
    {!dataFetched && <h1>Fetching Data</h1>}
    {/* FETCHING DATA SCREEN END */}

    {/* MAIN SCREEN */}
    {!orderSent && (
      <>
        <h1 onClick={() => console.log(currentItem)}>Welcome to {businessName}</h1>
        <h2>Table {table}</h2>
        <div className="menu">
          <div>
            <h4>Bebidas</h4> 
            {drinksIsEmpty ? 
              <h3>No hay bebidas registradas</h3>
            :
              <>
              {drinks && drinks.map((item, idx) =>
                // <li key={idx} onClick={() => addItem(item, 'drinks')}>
                //   <p>{item.name} - ${item.price}</p>
                //   <p>{item.description}</p>
                // </li>
                <ClientMenuItemCard 
                  key={idx}
                  setCurrentItem={setCurrentItem}
                  type="drinks"
                  idx={idx}
                  item={item}
                  currentItem={currentItem}
                  upgradeItemQty={upgradeItemQty}
                  addItem={addItem}
                  isCurrentItem={(currentItem.type === 'drinks' && currentItem.idx === idx)}
                  isInOrder={itemExistsInOrder(item.name, "drinks")}
                  // isInOrder = dice si esta en la orden para ver si se pone negro o no.
                />
              )}
              </>
            }
          </div>
          <div>
            <h4>Comidas</h4>
            {dishesIsEmpty ? 
              <h3>No hay comidas registradas</h3>
            :
              <>
              {dishes && dishes.map((item, idx) => 
                // <li key={idx} onClick={() => addItem(item, 'dishes')}>
                //   <p>{item.name} - ${item.price}</p>
                //   <p>{item.description}</p>
                // </li>     
                <ClientMenuItemCard 
                  key={idx}
                  setCurrentItem={setCurrentItem}
                  type="dishes"
                  currentItem={currentItem}
                  idx={idx}
                  item={item}
                  upgradeItemQty={upgradeItemQty}
                  addItem={addItem}
                  isCurrentItem={(currentItem.type === 'dishes' && currentItem.idx === idx)}
                  isInOrder={itemExistsInOrder(item.name, "dishes")}
                  // isInOrder = dice si esta en la orden para ver si se pone negro o no.
                />   
              )}
              </>
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
    {/* MAIN SCREEN END */}

    {/* ORDER SUCCESS SCREEN */}
    {orderSent && (
      <>
        <h2>ORDER SENT!</h2>
        <p>Your total is: {order.cost}</p>
      </>
    )}
    {/* ORDER SUCCESS SCREEN END */}

    {/* DEMO MODAL */}
    <Modal toggleModal={toggleModal} show={showModal}>
      <MenuDemoModal />
    </Modal>
    {/* DEMO MODAL END */}

    {/* ERROR SCREEN */}
    {error && <p>{error}</p>}
    {/* ERROR SCREEN END */}
  </div>
);

export default MenuView;