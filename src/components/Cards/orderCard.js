import React from 'react';

const OrderCard = ({
  el,
  idx,
  isCurrent,
  highlight,
  isSelected,
  getTimeDate,
  setSelectedOrder,
  updateSideboardState,
}) => {
  const cardType = () => {
    if(isCurrent && !highlight) return 'currentOrder';
    if(isCurrent && highlight) return 'highlightOrder';
    return 'pastOrder';
  };

  const toggleSideboard = () => {
    setSelectedOrder(el, idx);
    updateSideboardState(true)
  };

  const cardClasses = () => {
    let type = cardType();
    if(type === 'currentOrder') return 'orderCard';
    if(type === 'highlightOrder') return 'highlightCard';
    return 'orderCard pastOrderCard';
  };

  const itemsAreValid = (items) => items !== 0 ? true : false;

  return (
    <div 
      className={cardClasses()} 
      onClick={() => toggleSideboard()} 
      id={isSelected && "cardSelected"}
    >
      {cardType() === 'currentOrder' && (
        <>
          <div>
            <h3>{el.table === "takeout" ? "TAKEOUT" : `TABLE ${el.table}`}</h3>
            { el.table === "takeout" && <h3>#{el.orderNum}</h3> }
          </div>
          <h3 id="time">{getTimeDate(el.start)}</h3>
        </>
      )}
      {cardType() === 'highlightOrder' && (
        <div>
          <div className="highlightCard_header">
            <div>
              <h3>{el.table === "takeout" ? "TAKEOUT" : `TABLE ${el.table}`}</h3>
              { el.table === "takeout" && <h3>#{el.orderNum}</h3> }
            </div>
            <h3 id="time">{getTimeDate(el.start)}</h3>
          </div>
          <div className="highlightCard_items">
            {itemsAreValid(el.items.dishes) && (
              <div>
                <h3>Dishes</h3>
                {el.items.dishes.map((item, index) => (
                  <div className="item_dish" key={index}>
                    <h4>- {item.name}</h4>
                    <h4>x{item.qty}</h4>
                  </div>
                ))}
              </div>
            )}
            {itemsAreValid(el.items.drinks) && (
              <div>
                <h3>Drinks</h3>
                {el.items.drinks.map((item, index) => (
                  <div className="item_drink" key={index}>
                    <h4>- {item.name}</h4>
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
          <div className="pastOrder_header">
            <h3>{el.table === "takeout" ? "TAKEOUT" : `TABLE ${el.table}`}</h3>
            { el.table === "takeout" && <h3>#{el.orderNum}</h3> }
          </div>
          <div>
            <div className="pastOrder_time">
              <h3>Start</h3>
              <h3 id="time">{getTimeDate(el.start)}</h3>
            </div>
            <div className="pastOrder_time">
              <h3>End</h3>
              <h3 id="time">{getTimeDate(el.end)}</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderCard;