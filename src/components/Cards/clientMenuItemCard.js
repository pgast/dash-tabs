import React from 'react';

const ClientMenuItemCard = ({
  idx,
  item,
  type,
  addItem,
  isInOrder,
  deleteItem,
  getItemQty,
  currentItem,
  isCurrentItem,
  upgradeItemQty,
  setCurrentItem,
}) => {
  return (
    <> 
      {!isCurrentItem && (
        <div 
          id={isInOrder && "isInOrder"} 
          className="client_menuItemCard" 
          onClick={() => setCurrentItem(type, idx, item)}
        >
          <h3>{item.name.toUpperCase()}</h3>
          <h3>{isInOrder ? `x${getItemQty(item.name, type)}` : `$${item.price}`}</h3>
        </div>
      )}
      {isCurrentItem && (
        <div className="client_menuItemCard" id="isSelected">
          <div>
            <div>
              <h3>{item.name.toUpperCase()}</h3>
              <h3>${item.price}</h3>
            </div>
            <p>{item.description}</p>
          </div>
          <div>
            <div>
              <h3 onClick={() => upgradeItemQty(-1)}>-</h3>
              <h3>{currentItem.qty}</h3>
              <h3 onClick={() => upgradeItemQty(1)}>+</h3>
            </div>
            <h3 onClick={() => addItem()}>{isInOrder ? "SAVE" : "ADD"}</h3>
            {isInOrder && <h3 onClick={() => deleteItem(item, type)}>REMOVE</h3>}
          </div>
        </div>
      )}
    </>
  );
};

export default ClientMenuItemCard;