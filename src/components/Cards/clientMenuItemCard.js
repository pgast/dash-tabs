import React from 'react';

const ClientMenuItemCard = ({
  item,
  isCurrentItem,
  setCurrentItem,
  type,
  idx,
  currentItem,
  addItem,
  isInOrder,
  upgradeItemQty,
}) => {

  return (
    <> 
      {/* display card (not selected) */}
      {/* i */}
      <div onClick={() => setCurrentItem(type, idx, item)}>
        <p>{item.name} - ${item.price}</p>
        <p>{item.description}</p>
      </div>


      {/* CURRENTLY SELECTED CARD - MINI FORM */}
      {isCurrentItem && (
        <div>
          <div>
            <button onClick={() => upgradeItemQty(-1)}>-</button>
            <p>{currentItem.qty}</p>
            <button onClick={() => upgradeItemQty(1)}>+</button>
          </div>
          <button onClick={() => addItem()}>ADD</button>
        </div>
      )}

      {/* IS IN ORDER */}
      {isInOrder && (
        <div>
          IS IN ORDER
        </div>
      )}

      {/* display card selected (with quantity and add button) */}
      {/* display after item is added to order */}
    </>
  );
};

export default ClientMenuItemCard;