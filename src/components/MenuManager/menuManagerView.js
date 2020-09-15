import React from 'react';
import MenuSideboard from './menuSideboard';
import { MenuItemCard } from '../Cards';
import './style.css';

const MenuManagerView = ({
  menu,
  addItem,
  editItem,
  itemEdit,
  inputItem,
  cancelEdit,
  deleteItem,
  onChangeForm,
  addIsInvalid,
  saveEditItem,
  onChangeEdit,
  dishesIsEmpty,
  drinksIsEmpty,
  isInvalidEdit,
}) => {

  return (
    <div className="viewSmall">
      <div className="dashboardHeader">
        <h1>MENU</h1>
      </div>
      <div className="menuItemCardsView">
        <div>
          <h4>Bebidas</h4>
          <div className="menuItemCards_items">
            {drinksIsEmpty ? 
              <h3>NO HAY BEBIDAS REGISTRADAS</h3>
            :
              <>
                {menu.drinks && menu.drinks.map((el, idx) => 
                // REDUNDANTE TENER KEY Y IDX AL MISMO TIEMPO
                  <MenuItemCard 
                    el={el}
                    idx={idx}
                    key={idx}
                    editItem={editItem}
                    editItemType={"drinks"}
                    cancelEdit={cancelEdit}
                    isSelected={itemEdit.name === el.name ? true : false}
                  />
                )}
              </>
            }
          </div>
        </div>
        <div>
          <h4>Comidas</h4>
          <div className="menuItemCards_items">  
            {dishesIsEmpty ?
              <h3>NO HAY COMIDAS REGISTRADAS</h3>
            :
              <>
                {menu.dishes && menu.dishes.map((el, idx) => 
                // REDUNDANTE TENER IDX Y KEY AL MISMO TIEMPO
                  <MenuItemCard 
                    el={el}
                    idx={idx}
                    key={idx}
                    editItem={editItem}
                    editItemType={"dishes"}
                    isSelected={itemEdit.name === el.name ? true : false}
                  /> 
                )}
              </>
            }
          </div>
        </div>
      </div>
      <div className="fixedSideboard">
        <MenuSideboard 
          addItem={addItem}
          itemEdit={itemEdit}
          inputItem={inputItem}
          deleteItem={deleteItem}
          onChangeEdit={onChangeEdit}
          onChangeForm={onChangeForm}
          addIsInvalid={addIsInvalid}
          saveEditItem={saveEditItem}
          isInvalidEdit={isInvalidEdit}
        />
      </div>
    </div>
  )
};

export default MenuManagerView;