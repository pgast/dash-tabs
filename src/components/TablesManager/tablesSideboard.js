import React from 'react';

const TablesSideboard = ({
  addTable,
  tableEdit,
  inputTable,
  deleteTable,
  toggleModal,
  setTableEdit,
  sideboardView,
  setInputTable,
  saveEditTable,
  editIsInvalid,
  inputIsInvalid,
  cancelAddTable,
  cancelTableEdit,
  toggleAddTableForm,
}) => {
  return (
    <div className="tablesSideboard">
      {/* Menu */}
      {sideboardView === "menu" && (
        <div className="tablesSideboard_view main">
          <div 
            className="btn"
            onClick={() => toggleAddTableForm("open")}
            >
            ADD TABLE
          </div>
          <div>
            <div 
              onClick={() => toggleModal("tables")} 
              className="btn btn_secondary"
            >
              GET TABLES QR CODES
            </div>
            <div 
              className="btn btn_secondary"
              onClick={() => toggleModal("takeout")}
            >
              GET TAKEOUT QR CODE
            </div>
          </div>
        </div>
      )}
      {/* Add Table Form */}
      {sideboardView === "addTable" && (
        <>
          <div className="tablesSideboard_view">
            <h3>ADD NEW TABLE</h3>
            <div className="inputGroup">
              <h4>Table Number</h4>
              <input 
                type="number"
                value={inputTable.number}
                onChange={(e) => setInputTable("number", e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <h4>Description</h4>
              <textarea 
                rows="3"
                cols="50"
                form="usrform"
                value={inputTable.description}
                onChange={(e) => setInputTable("description", e.target.value)}
              />
            </div>
          </div>
          <div className="menuSideboard_actionButtons">
            <div 
              onClick={inputIsInvalid ? null : (e) => addTable(e)}
              className={inputIsInvalid ? "btn btn_disabled" : "btn"}
            >
              ADD
            </div>
            <div 
              className="btn btn_secondary"
              onClick={() => cancelAddTable()}
            >
              CANCEL
            </div>
          </div>
        </>
      )}
      {/* Edit Table Form */}
      {sideboardView === "editTable" && (
        <>
          <div className="tablesSideboard_view">
            <h3>EDITING TABLE</h3>
            <div className="inputGroup">
              <h4>Table Number</h4>
              <input 
                type="number"
                value={tableEdit.newNumber}
                onChange={(e) => setTableEdit("newNumber", e.target.value)}
              />
            </div>
            <div className="inputGroup">
              <h4>Description</h4>
              <textarea 
                rows="3"
                cols="50"
                form="usrform"
                value={tableEdit.newDescription}
                onChange={(e) => setTableEdit("newDescription", e.target.value)}
              />
            </div>
            <div 
              className={editIsInvalid ? "btn btn_disabled" : "btn btn_secondary" }
              id="showQr"
              onClick={editIsInvalid ? null : () => toggleModal(tableEdit.newNumber)}
            >
              SHOW QR
            </div>
          </div>
          <div className="menuSideboard_actionButtons">
              <div 
                className={editIsInvalid ? "btn btn_disabled" : "btn"}
                onClick={editIsInvalid ? null : (e) => saveEditTable(e)}
              >
                SAVE
              </div>
              <div 
                className="btn btn_secondary"
                onClick={() => deleteTable(tableEdit.current)}
              >
                DELETE
              </div>
              <div 
                className="btn btn_secondary"
                onClick={() => cancelTableEdit()}
              >
                CANCEL
              </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TablesSideboard;