import React from 'react';
import Modal from '../Modals';
import { ClientMenuItemCard } from '../Cards';
import MenuDemoModal from '../Modals/MenuDemoModal';
import './style.css';

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
    <div className="menuHeader">
      <h3>MENU</h3>
      <h3>{businessName}</h3>
    </div>
    {/* FETCHING DATA SCREEN */}
    {!dataFetched && <h1>Fetching Data</h1>}
    {/* FETCHING DATA SCREEN END */}

    {/* MAIN SCREEN */}
    {!orderSent && (
      <div className="client_menuItems">
        <div>
          <h4>DRINKS</h4> 
          {drinksIsEmpty ? 
            <h3>No hay bebidas registradas</h3>
          :
            <>
            {drinks && drinks.map((item, idx) =>
              <ClientMenuItemCard 
                key={idx}
                idx={idx}
                item={item}
                type="drinks"
                addItem={addItem}
                deleteItem={deleteItem}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                upgradeItemQty={upgradeItemQty}
                isInOrder={itemExistsInOrder(item.name, "drinks")}
                isCurrentItem={(currentItem.type === 'drinks' && currentItem.idx === idx)}
              />
            )}
            </>
          }
        </div>
        <div>
          <h4>DISHES</h4>
          {dishesIsEmpty ? 
            <h3>No hay comidas registradas</h3>
          :
            <>
            {dishes && dishes.map((item, idx) =>    
              <ClientMenuItemCard 
                key={idx}
                idx={idx}
                item={item}
                type="dishes"
                addItem={addItem}
                deleteItem={deleteItem}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                upgradeItemQty={upgradeItemQty}
                isInOrder={itemExistsInOrder(item.name, "dishes")}
                isCurrentItem={(currentItem.type === 'dishes' && currentItem.idx === idx)}
              />   
            )}
            </>
          }
        </div>
 

        {/* <div className="clientMenu_orderForm">          
          <div>
            <div>
              <label>Extra instructions or request</label>
              <textarea rows="4" cols="50" form="usrform"  onChange={(e) =>  handleFormInput(e.target.value)}/>
            </div>
          </div>
        </div> */}
      </div>
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

    <div className="bottomNav">
      <div>
        <h4>TOTAL:</h4>
        <h4>${order.cost}</h4>
      </div>
      <div 
        onClick={orderIsEmpty ? null : () => sendOrder()}
        className={orderIsEmpty ? "btn btn_disabled" : "btn"}
      >
        ORDER
      </div>
    </div>
  </div>
);

export default MenuView;