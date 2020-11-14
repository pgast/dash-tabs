import React, { Component } from 'react';

import './style.css';
import TablesManagerView from './tablesManagerView';

class TablesManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tables: [],
      sideboard: "menu",
      showModal: false,
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
      tablesQrCodes: null,
      error: { exists: false },
      qrSrc: {qr: null, table: null},
    }
  }

  componentDidMount() {
    this.setState({ tables: this.props.dbTables})
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.dbTables !== prevProps.dbTables) {
      this.setState({ tables: this.props.dbTables });
    }
  }
  
  numberIsInvalid = (number) => {
    return (number <= 0) || (number === '');
  };

  tableIsDuplicate = (newNumber, currentIdx=null) => {
    if(currentIdx !== null) {
      let newTables = this.state.tables.filter((el, idx) => idx !== currentIdx);
      for(let j=0; j<newTables.length; j++) {
        if(newTables[j].number === newNumber) return true;
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
    this.setState({tablesQrCodes: newQrs});
  }

  editTable = (tableIdx) => {
    let newTableEdit = { 
      current: tableIdx,
      newNumber: this.state.tables[tableIdx].number,
      waitingOrder: this.state.tables[tableIdx].waitingOrder,
      newDescription: this.state.tables[tableIdx].description,
     }
    this.setState({ 
      sideboard: "editTable",
      tableEdit: newTableEdit, 
      qrSrc: {src: null, table: null},
    });
  };

  resetTableEdit = () => {
    let newTableEdit = {
      current: '',
      newNumber: '',
      newDescription: '',
      waitingOrder: false,
    }
    this.setState({ 
      sideboard:"menu", 
      tableEdit: newTableEdit, 
      qrSrc: {src: null, table: null},
    });
  }

  deleteTable = (deleteIndex) => {
    let newTables = [...this.state.tables].filter((el, idx) => idx !== deleteIndex);
    this.setState({ sideboard:"menu", tables: newTables });
    this.props.updateTablesDb(newTables);
    this.resetTableEdit();
  }

  saveEditTable = (e) => {
    e.preventDefault();
    if(this.tableIsDuplicate(this.state.tableEdit.newNumber*1, this.state.tableEdit.current)) {
      let newError = { ...this.state.error, msg: 'TABLE NUMBER IS DUPLICATE, PLEASE TRY ANOTHER NUMBER' };
      this.setState({ error: newError });
    } else {
      let newTables = [...this.state.tables]
      newTables[this.state.tableEdit.current] = { 
        number: this.state.tableEdit.newNumber*1, 
        waitingOrder: this.state.tableEdit.waitingOrder, 
        description: this.state.tableEdit.newDescription, 
      };
      this.setState({ 
        sideboard:"menu", 
        tables: newTables,
        error: { exists: false },
      });
      this.props.updateTablesDb(newTables);
      this.resetTableEdit();
    }
  };

  toggleAddTableForm = (input) => {
    this.setState({ sideboard: input === "open" ? "addTable" : "menu" });
  };

  addTable = (e) => {
    e.preventDefault();
    if(this.tableIsDuplicate(this.state.inputTable.number*1)) {
      let newError = { ...this.state.error, msg: 'TABLE NUMBER IS DUPLICATE, PLEASE TRY ANOTHER NUMBER' };
      this.setState({ error: newError });
    } else {
      if(!this.state.tables) {
        this.setState({ tables: [] });
      } else {
        let newTables = [...this.state.tables];
        let number = parseInt(this.state.inputTable.number, 10);
        newTables.push({ ...this.state.inputTable, number});
        this.setState({ 
          sideboard: "menu",
          tables: newTables,
          inputTable: { number: '', description: '', waitingOrder: false },
          error: { exists: false }
        });

        this.props.updateTablesDb(newTables);
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

  toggleModal = (tableNumber=false) => {
    switch(tableNumber) {
      case "takeout":
        this.setState({
          showModal: !this.state.showModal,
          qrSrc: {src: this.props.createQR(null, true), table: tableNumber}
        });
        break;

      case "tables":
        this.generateQrCodes();
        this.setState({ showModal: !this.state.showModal });
        break;

      case false:
        this.setState({ showModal: !this.state.showModal, tablesQrCodes: null });
        break;

      default:
        this.setState({
          showModal: !this.state.showModal,
          qrSrc: {src: this.props.createQR(tableNumber, false), table: tableNumber}
        });
    };
  }

  clearError = () => {this.setState({ error: { exists: false } }) };

  cancelTableEdit = () => {
    this.resetTableEdit();
    this.clearError();
    this.toggleAddTableForm('close');
  };

  cancelAddTable = () => {
    this.toggleAddTableForm("close")
    this.clearError();
  };

  render() {
    const { 
      qrSrc, 
      error, 
      tables, 
      tableEdit, 
      sideboard, 
      showModal, 
      inputTable, 
      tablesQrCodes, 
    } = this.state;
    const inputIsInvalid = this.numberIsInvalid(inputTable.number) || inputTable.description === '';
    const editIsInvalid = this.numberIsInvalid(tableEdit.newNumber) || tableEdit.newDescription === '';
    const tablesIsEmpty = tables === 0 || tables.length === 0 ? true : false;

    return (
      <TablesManagerView 
        qrSrc={qrSrc}
        error={error}
        tables={tables}
        tableEdit={tableEdit}
        showModal={showModal}
        inputTable={inputTable}
        addTable={this.addTable}
        sideboardView={sideboard}
        editTable={this.editTable}
        tablesIsEmpty={tablesIsEmpty}
        editIsInvalid={editIsInvalid}
        tablesQrCodes={tablesQrCodes}
        deleteTable={this.deleteTable}
        toggleModal={this.toggleModal}
        inputIsInvalid={inputIsInvalid}
        setTableEdit={this.setTableEdit}
        saveEditTable={this.saveEditTable}
        setInputTable={this.setInputTable}
        cancelAddTable={this.cancelAddTable}
        cancelTableEdit={this.cancelTableEdit}
        generateQrCodes={this.generateQrCodes}
        updateTablesDb={this.props.updateTablesDb}
        toggleAddTableForm={this.toggleAddTableForm}
      />
    )
  }
}

export default TablesManager;