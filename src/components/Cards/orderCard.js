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

  const cardClasses = () => cardType() !== "highlightOrder" ? "orderCard" : "highlightCard";

  const itemsAreValid = (items) => items !== 0 ? true : false;


  return (
    <div onClick={() => setSelectedOrder(el, idx)} className={cardClasses()} id={isSelected && "cardSelected"}>
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
            <div className="highlightCard_header_time">
              <h3>{getDate(el.start)}</h3>
            </div>
          </div>
          <div className="highlightCard_items">
            {itemsAreValid(el.items.dishes) && (
              <div>
                <h3>DISHES</h3>
                {el.items.dishes.map((item, index) => (
                  <div key={index}>
                    <h4>{item.name}</h4>
                    <h4>x{item.qty}</h4>
                  </div>
                ))}
              </div>
            )}
            {itemsAreValid(el.items.drinks) && (
              <div>
                <h3>DRINKS</h3>
                {el.items.drinks.map((item, index) => (
                  <div key={index}>
                    <h4>{item.name}</h4>
                    <h4>x{item.qty}</h4>
                  </div>
                ))}
              </div>
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