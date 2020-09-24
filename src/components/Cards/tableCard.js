import React from 'react';

const TableCard = ({
  idx,
  table,
  editTable,
  isSelected,
}) => {

  return (
    <div 
      className="menuItemCard" 
      id={isSelected && "cardSelected"}
      onClick={() => editTable(idx)}
    >
      <h3>
        Table number {table.number} - {table.description}
      </h3>
    </div>
  );
};

export default TableCard;