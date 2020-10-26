import React from 'react';

const MenuItemCard = ({
  el,
  idx,
  editItem,
  isSelected,
  editItemType,
}) => {
  return (
    <div 
      className="menuItemCard" 
      id={isSelected && "cardSelected"}
      onClick={() => editItem(el, editItemType, idx)}
    >
      <h3>
        {el.name}
      </h3>
      <div>
        <div>
          <h3>
            Price
          </h3>
          <h3 id="time"> 
            ${el.price}
          </h3>
        </div>
        <h3 id="time">
          {el.available ? "Available" : "Not Available"}
        </h3>
      </div>
    </div>
  );
};

export default MenuItemCard;