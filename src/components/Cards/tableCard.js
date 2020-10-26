import React from 'react';

const TableCard = ({
  idx,
  table,
  editTable,
  isSelected,
}) => {
  return (
    <div 
      className="tableCard" 
      onClick={() => editTable(idx)}
      id={isSelected && "cardSelected"}
    >
      <h3>
        #{table.number}
      </h3>
      <h3 id="time">
        {table.description}
      </h3>
    </div>
  );
};

export default TableCard;