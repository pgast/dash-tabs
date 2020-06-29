import React, { useState } from 'react';

export default function TablesManager({ createQR, qrCode, dbTables, updateTablesDb }) {
  const [tables, setTables] = useState(dbTables);
  const [inputTable, setInputTable] = useState({ number: '', description: '', waitingOrder: false });
  const [tableEdit, setTableEdit] = useState({ 
    current: '', 
    newNumber: '', 
    newDescription: '', 
    waitingOrder: false, 
  });

  const numberIsInvalid = (number) => (number <= 0) || (number === '');
  const inputIsInvalid = numberIsInvalid(inputTable.number) || inputTable.description === '';
  const editIsInvalid = numberIsInvalid(tableEdit.newNumber) || tableEdit.newDescription === '';

  const [error, setError] = useState({ exists: false });

  const tableIsDuplicate = (newNumber, currentIdx=null) => {

    if(currentIdx !== null) {
      let newTables = tables.filter((el, idx) => idx !== currentIdx);
      
      for(let j=0; j<newTables.length; j++) {
        if(newTables[j].number === tableEdit.newNumber) return true;
      }

    } else {
      for(let i=0; i<tables.length; i++) {
        if(tables[i].number === newNumber) return true;
      }
    }

    return false;
  }

  const editTable = (tableIdx) => {
    setTableEdit({
      current: tableIdx,
      newNumber: tables[tableIdx].number,
      waitingOrder: tables[tableIdx].waitingOrder,
      newDescription: tables[tableIdx].description,
    });
  };

  const resetTableEdit = () => {
    setTableEdit({ 
      current: '', 
      newNumber: '', 
      newDescription: '', 
      waitingOrder: false, 
    });
  }

  const deleteTable = (deleteIndex) => {
    let newTables = [...tables].filter((el, idx) => idx !== deleteIndex);
    setTables(newTables);
    resetTableEdit();
  }

  const saveEditTable = (e) => {
    e.preventDefault();

    if(tableIsDuplicate(tableEdit.newNumber, tableEdit.current)) {
      let newError = { ...error, msg: 'ITEM NUMBER IS DUPLICATE' };
      setError(newError);

    } else {
      let newTables = [...tables]
      newTables[tableEdit.current] = { 
        number: tableEdit.newNumber*1, 
        waitingOrder: tableEdit.waitingOrder, 
        description: tableEdit.newDescription, 
      };
  
      setTables(newTables);
      resetTableEdit();
    }
  };

  const addTable = (e) => {
    e.preventDefault();

    if(tableIsDuplicate(inputTable.number*1)) {
      let newError = { ...error, msg: 'ITEM NUMBER IS DUPLICATE' };
      setError(newError);

    } else {
      let newTables = [...tables];
      let number = parseInt(inputTable.number, 10);
      newTables.push({ ...inputTable, number});
      setInputTable({ number: '', description: '', waitingOrder: false });
      setTables(newTables);
    }
  }

  return (
    <>
    <h2 onClick={() => console.log(tables)}>Tables Manager</h2>
    {error && <h4>{error.msg}</h4>}
    <hr />

    <ol>
      {tables.map((el, idx) => (
        <React.Fragment key={idx}>
          {tableEdit.current !== idx ? 
            <li key={idx} onClick={() => editTable(idx)}>Table number {el.number} - {el.description}</li>
          :
            <li key={idx}>
              <form onSubmit={(e) => saveEditTable(e)}>
                <input 
                  type="number"
                  value={tableEdit.newNumber}
                  placeholder="New table number"
                  onChange={(e) => setTableEdit({ ...tableEdit, newNumber: e.target.value })}
                />
                <input 
                  type="text"
                  value={tableEdit.newDescription}
                  placeholder="New table description"
                  onChange={(e) => setTableEdit({ ...tableEdit, newDescription: e.target.value })}
                />
                <button disabled={editIsInvalid} type="submit">Save</button>
                <button onClick={() => deleteTable(idx)}>Delete Item</button>
                <button onClick={() => resetTableEdit()}>Cancel Edit</button>
              </form>
            </li>
          }
        </React.Fragment>
      ))}
    </ol>

    <hr />

    {/* ADD NEW TABLE FORM */}
    <form onSubmit={(e) => addTable(e)}>
      <input 
        type="number"
        value={inputTable.number}
        placeholder="Table Number"
        onChange={(e) => setInputTable({...inputTable, number: e.target.value})}
      />
      <input 
        type="text"
        value={inputTable.description}
        placeholder="Table description"
        onChange={(e) => setInputTable({...inputTable, description: e.target.value})}
      />
      <button disabled={inputIsInvalid} type="submit">Add Table</button>
    </form>

    <div onClick={() => updateTablesDb(tables)} style={{ background: 'black', color: 'white' }}>
      <h3>SAVE CHANGES AND UPDATE</h3>
    </div>


    {/* GENERATE QR CODE WITH PUSH OF A BUTTON and display qr code here */}
    <h3>QR Code</h3>
    <button onClick={() => createQR()}>Generate Code</button>

    {qrCode !== '' && (
      <img 
        src={qrCode}
        alt="" 
        title="" 
        />
    )}
    </>
  );
};