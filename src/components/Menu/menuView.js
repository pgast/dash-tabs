import React from 'react';
import Modal from '../Modals';
import { ClientMenuItemCard } from '../Cards';
import MenuDemoModal from '../Modals/MenuDemoModal';
import OrderConfirmScreen from './orderConfirmScreen';
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
  confirmScreen,
  dataFetched,
  getItemQty,
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
  toggleConfirmScreen,
}) => (
  <div className="menuView"> 
    {!orderSent && (
      <div className="menuHeader">
        <h3>MENU</h3>
        <h3>{businessName}</h3>
      </div>
      // AGREGAR EL CAMBIO DE HEADER A ORDER CUANDO ESTA EN CONFIRM ORDER
    )}
    {/* FETCHING DATA SCREEN */}
    {!dataFetched && <h1>Fetching Data</h1>}
    {/* FETCHING DATA SCREEN END */}

    {/* MAIN SCREEN */}
    {(!orderSent && !confirmScreen) && (
      <div className="client_menuItems">
        <div>
          {!drinksIsEmpty && ( 
            <>
            <h4>DRINKS</h4> 
            {drinks && drinks.map((item, idx) =>
              <ClientMenuItemCard 
                key={idx}
                idx={idx}
                item={item}
                type="drinks"
                addItem={addItem}
                getItemQty={getItemQty}
                deleteItem={deleteItem}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                upgradeItemQty={upgradeItemQty}
                isInOrder={itemExistsInOrder(item.name, "drinks")}
                isCurrentItem={(currentItem.type === 'drinks' && currentItem.idx === idx)}
              />
            )}
            </>
          )}
        </div>
        <div>
          {!dishesIsEmpty && (           
            <>
            <h4>DISHES</h4>
            {dishes && dishes.map((item, idx) =>    
              <ClientMenuItemCard 
                key={idx}
                idx={idx}
                item={item}
                type="dishes"
                addItem={addItem}
                deleteItem={deleteItem}
                getItemQty={getItemQty}
                currentItem={currentItem}
                setCurrentItem={setCurrentItem}
                upgradeItemQty={upgradeItemQty}
                isInOrder={itemExistsInOrder(item.name, "dishes")}
                isCurrentItem={(currentItem.type === 'dishes' && currentItem.idx === idx)}
              />   
            )}
            </>
          )}
        </div>
      </div>
    )}
    {/* MAIN SCREEN END */}

    {/* ORDER SUCCESS SCREEN */}
    {orderSent && (
      <div>SUCCESS! ORDER SENT</div>
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

    {/* CONFIRM SCREEN */}
    {(confirmScreen && !orderSent) && (
      <OrderConfirmScreen 
        order={order}
        handleFormInput={handleFormInput}
      />
    )}
    {/* confirm screen / */}

    {!orderSent && (
      <div className="bottomNav">
        <div>
          <h4>TOTAL:</h4>
          <h4>${order.cost}</h4>
        </div>
        <div 
          onClick={confirmScreen ? () => sendOrder() : () => toggleConfirmScreen()}
          className={orderIsEmpty ? "btn btn_disabled" : "btn"}
        >
          {confirmScreen ? "CONFIRM" : "ORDER"}
        </div>
      </div>
    )}
  </div>
);

export default MenuView;