import React from 'react';

const OrderCard = ({
  el,
  idx,
  getDate,
  isCurrent,
  highlight,
  isSelected,
  setSelectedOrder,
}) => {
  const cardType = () => {
    if(isCurrent && !highlight) return 'currentOrder';
    if(isCurrent && highlight) return 'highlightOrder';
    return 'pastOrder';
  }

  const cardClasses = () => {
    let cardStyle = cardType() !== "highlightOrder" ? "orderCard" : "highlightCard";
    if(isSelected) return `${cardStyle} cardSelected`;
    return cardStyle;
  }

  const itemsAreValid = (items) => items !== 0 ? true : false;


  return (
    <div onClick={() => setSelectedOrder(el, idx)} className={cardClasses()}>
      {cardType() === 'currentOrder' && (
        <>
          <h3>#{el.orderNum}</h3> 
          <h3>{el.table === "takeout" ? "TAKEOUT" : `TABLE ${el.table}`}</h3>
        </>
      )}
      {cardType() === 'highlightOrder' && (
        <div onClick={() => console.log(el)}>
          <div className="highlightCard_header">
            <div className="highlightCard_header_title">
              <h3>#{el.orderNum}</h3> 
              <h3>{el.table === "takeout" ? "TAKEOUT" : `TABLE ${el.table}`}</h3>
            </div>
            <div>
              <h3>{getDate(el.start)}</h3>
            </div>
          </div>
          <div className="highlightCard_items">
            {itemsAreValid(el.items.dishes) && (
              <>
                <h3>DISHES</h3>
                {el.items.dishes.map((item, index) => (
                  <div key={index}>{item.name} - Qty: {item.qty}</div>
                ))}
              </>
            )}
            {itemsAreValid(el.items.drinks) && (
              <>
                <h3>DRINKS</h3>
                {el.items.drinks.map((item, index) => (
                  <div key={index}>{item.name} - Qty: {item.qty}</div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      {cardType() === 'pastOrder' && (
        <>
          <h3>#{el.orderNum}</h3> 
          <h3>{el.table === "takeout" ? "TAKEOUT" : `TABLE ${el.table}`}</h3>
        </>
      )}
    </div>
  );
};

export default OrderCard;