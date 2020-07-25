import React, { Component } from 'react';

class TablesManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      inputTable: {
        number: '',
        description: '',
        waitingOrder: false,
      },
      tableEdit: {
        current: '',
        newNumber: '',
        newDescription: '',
        waitingOrder: false,
      },
      showQrs: false,
      tablesQrCodes: null,
      error: { exists: false },
      displayQr: null,
    }
  }

  componentDidMount() {
    this.setState({ tables: this.props.dbTables})
  }

  componentDidUpdate(prevProps) {
    if(this.props.dbTables !== prevProps.dbTables) {
      this.setState({ tables: this.props.dbTables });
    }
  }

  numberIsInvalid = (number) => {
    return (number <= 0) || (number === '');
  };

  // REVISAR PORQUE FUNCIONA ESTO
  tableIsDuplicate = (newNumber, currentIdx=null) => {
    if(currentIdx !== null) {
      let newTables = this.state.tables.filter((el, idx) => idx !== currentIdx);
      for(let j=0; j<newTables.length; j++) {
        if(newTables[j].number === this.state.tableEdit.newNumber) return true;
      }
    } else {
      for(let i=0; i<this.state.tables.length; i++) {
        if(this.state.tables[i].number === newNumber) return true;
      }
    }
    return false;
  }

  generateQrCodes = () => {
    let newQrs = [];
    this.state.tables.forEach(el => {
      newQrs.push({ number: el.number, qr: this.props.createQR(el.number) })
    });

    newQrs.push({ number: "takeout", qr: this.props.createQR(null, true) });
    this.setState({ tablesQrCodes: newQrs, showQrs: true });
  }

  generateSingleQr = (table, e, takeout=false) => {
    e.preventDefault();
    this.setState({ displayQr: this.props.createQR(table.number, takeout) });
  };

  editTable = (tableIdx) => {
    let newTableEdit = { 
      current: tableIdx,
      newNumber: this.state.tables[tableIdx].number,
      waitingOrder: this.state.tables[tableIdx].waitingOrder,
      newDescription: this.state.tables[tableIdx].description,
     }
    this.setState({ tableEdit: newTableEdit, displayQr: null })
  };

  resetTableEdit = () => {
    let newTableEdit = {
      current: '',
      newNumber: '',
      newDescription: '',
      waitingOrder: false,
    }
    this.setState({ tableEdit: newTableEdit, displayQr: null });
  }

  deleteTable = (deleteIndex) => {
    let newTables = [...this.state.tables].filter((el, idx) => idx !== deleteIndex);
    this.setState({ tables: newTables });
    this.resetTableEdit();
  }

  saveEditTable = (e) => {
    e.preventDefault();
    if(this.tableIsDuplicate(this.state.tableEdit.newNumber, this.state.tableEdit.current)) {
      let newError = { ...this.state.error, msg: 'ITEM NUMBER IS DUPLICATE' };
      this.setState({ error: newError });
    } else {
      let newTables = [...this.state.tables]
      newTables[this.state.tableEdit.current] = { 
        number: this.state.tableEdit.newNumber*1, 
        waitingOrder: this.state.tableEdit.waitingOrder, 
        description: this.state.tableEdit.newDescription, 
      };
      this.setState({ tables: newTables });
      this.resetTableEdit();
    }
  };

  addTable = (e) => {
    e.preventDefault();
    if(this.tableIsDuplicate(this.state.inputTable.number*1)) {
      let newError = { ...this.state.error, msg: 'ITEM NUMBER IS DUPLICATE' };
      this.setState({ error: newError });
    } else {
      if(!this.state.tables) {
        this.setState({ tables: [] });
      } else {
        let newTables = [...this.state.tables];
        let number = parseInt(this.state.inputTable.number, 10);
        newTables.push({ ...this.state.inputTable, number});
        this.setState({ 
          tables: newTables,
          inputTable: { number: '', description: '', waitingOrder: false } 
        });
      }
    }
  }

  setTableEdit = (key, value) => {
    let newTableEdit = { ...this.state.tableEdit };
    newTableEdit[key] = value;
    this.setState({ tableEdit: newTableEdit });
  }

  setInputTable = (key, value) => {
    let newInputTable = { ...this.state.inputTable };
    newInputTable[key] = value;
    this.setState({ inputTable: newInputTable });
  }

  render() {
    const { inputTable, tableEdit, tables, error, tablesQrCodes, showQrs } = this.state;
    const inputIsInvalid = this.numberIsInvalid(inputTable.number) || inputTable.description === '';
    const editIsInvalid = this.numberIsInvalid(tableEdit.newNumber) || tableEdit.newDescription === '';
    const tablesIsEmpty = tables === 0 || tables.length === 0 ? true : false;

    return (
      <>
        <h2 onClick={() => console.log(this.state)}>Tables Manager</h2>
        {error && <h4>{error.msg}</h4>}
        <hr />
    
        {tablesIsEmpty ?
          <h3>NO TABLES REGISTERED</h3>
          :
          <ol>
            {tables.map((el, idx) => (
              <React.Fragment key={idx}>
                {tableEdit.current !== idx ? 
                  <li key={idx} onClick={() => this.editTable(idx)}>Table number {el.number} - {el.description}</li>
                :
                  <li key={idx}>
                    <form onSubmit={(e) => this.saveEditTable(e)}>
                      <input 
                        type="number"
                        value={tableEdit.newNumber}
                        placeholder="New table number"
                        onChange={(e) => this.setTableEdit("newNumber", e.target.value)}
                      />
                      <input 
                        type="text"
                        value={tableEdit.newDescription}
                        placeholder="New table description"
                        onChange={(e) => this.setTableEdit("newDescription", e.target.value)}
                      />

                      {this.state.displayQr !== null && 
                        <>
                        <h5>Table number: {el.number}</h5>
                        <img src={this.state.displayQr} alt="" title="" />
                        </>
                      }

                      <button disabled={editIsInvalid} type="submit">Save</button>
                      <button onClick={(e) => this.generateSingleQr(el.number, e)}>Get Table QR Code</button>
                      <button onClick={() => this.deleteTable(idx)}>Delete Item</button>
                      <button onClick={this.resetTableEdit}>Cancel Edit</button>
                    </form>
                  </li>
                }
              </React.Fragment>
            ))}
          </ol>
        }
    
        <hr />
        <div>
          <button onClick={(e) => this.generateSingleQr({number: null}, e, true)}>Get Takeout QR</button>
          {(this.state.displayQr !== null && this.state.tableEdit.current === '') &&
            <>
              <h5>Takeout</h5>
              <img src={this.state.displayQr} alt="" title="" />
            </>
          }
        </div>
        <hr />
    
        <form onSubmit={(e) => this.addTable(e)}>
          <input 
            type="number"
            value={inputTable.number}
            placeholder="Table Number"
            onChange={(e) => this.setInputTable("number", e.target.value)}
          />
          <input 
            type="text"
            value={inputTable.description}
            placeholder="Table description"
            onChange={(e) => this.setInputTable("description", e.target.value)}
          />
          <button disabled={inputIsInvalid} type="submit">Add Table</button>
        </form>
    
        <div onClick={() => this.props.updateTablesDb(tables)} style={{ background: 'black', color: 'white' }}>
          <h3>SAVE CHANGES AND UPDATE</h3>
        </div>
    
        <hr />

        <h3>QR Codes</h3>
        <button onClick={this.generateQrCodes}>Generate Tables QR Codes</button>
        {
          showQrs && (
            <React.Fragment>
              <button onClick={() => this.setState({ showQrs: false })}>Close QRs</button>
              <ol>
                {tablesQrCodes.map((el, idx) => (
                  <li key={idx}>
                    <h5>Table number: {el.number}</h5>
                    <img src={el.qr} alt="" title="" />
                  </li>
                ))}
              </ol>
            </React.Fragment>
          )
        }
      </>
    )
  }
}

export default TablesManager;