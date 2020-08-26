import React from 'react';

const TablesManagerView = ({
  error,
  tables,
  showQrs,
  addTable,
  closeQrs,
  tableEdit,
  displayQr,
  editTable,
  inputTable,
  deleteTable,
  setTableEdit,
  tablesIsEmpty,
  editIsInvalid,
  saveEditTable,
  setInputTable,
  tablesQrCodes,
  inputIsInvalid,
  resetTableEdit,
  updateTablesDb,
  generateQrCodes,
  generateSingleQr,
}) => (
  <>
    <div className="dashboardHeader">
      <h1>TABLES</h1>
    </div>
    <div className="view">
      {error && <h4>{error.msg}</h4>}
      <hr />

      {tablesIsEmpty ?
        <h3>NO TABLES REGISTERED</h3>
        :
        <ol>
          {tables.map((el, idx) => (
            <React.Fragment key={idx}>
              {tableEdit.current !== idx ? 
                <li key={idx}>
                  Table number {el.number} - {el.description}
                  <button onClick={() => editTable(idx)}>Edit</button>
                  <button onClick={(e) => generateSingleQr(el.number, e, idx)}>Get Table QR Code</button>

                  {(displayQr.src !== null && displayQr.current === idx) && 
                    <>
                      <h5>Table number: {el.number}</h5>
                      <img src={displayQr.src} alt="" title="" />
                    </>
                  }
                </li>
              :
                <li key={idx}>
                  <form onSubmit={(e) => saveEditTable(e)}>
                    <input 
                      type="number"
                      value={tableEdit.newNumber}
                      placeholder="New table number"
                      onChange={(e) => setTableEdit("newNumber", e.target.value)}
                    />
                    <input 
                      type="text"
                      value={tableEdit.newDescription}
                      placeholder="New table description"
                      onChange={(e) => setTableEdit("newDescription", e.target.value)}
                    />
                    <button disabled={editIsInvalid} type="submit">Save</button>
                    <button onClick={() => deleteTable(idx)}>Delete Item</button>
                    <button onClick={resetTableEdit}>Cancel Edit</button>
                  </form>
                </li>
              }
            </React.Fragment>
          ))}
        </ol>
      }

      <hr />
      <div>
        <button onClick={(e) => generateSingleQr(null, e, 'takeout', true)}>Get Takeout QR</button>
        {(displayQr.src !== null && displayQr.current === 'takeout') &&
          <>
            <h5>Takeout</h5>
            <img src={displayQr.src} alt="" title="" />
          </>
        }
      </div>
      <hr />

      <form onSubmit={(e) => addTable(e)}>
        <input 
          type="number"
          value={inputTable.number}
          placeholder="Table Number"
          onChange={(e) => setInputTable("number", e.target.value)}
        />
        <input 
          type="text"
          value={inputTable.description}
          placeholder="Table description"
          onChange={(e) => setInputTable("description", e.target.value)}
        />
        <button disabled={inputIsInvalid} type="submit">Add Table</button>
      </form>

      <div onClick={() => updateTablesDb(tables)} style={{ background: 'black', color: 'white' }}>
        <h3>SAVE CHANGES AND UPDATE</h3>
      </div>

      <hr />

      <h3>QR Codes</h3>
      <button onClick={generateQrCodes}>Generate Tables QR Codes</button>
      {
        showQrs && (
          <React.Fragment>
            <button onClick={() => closeQrs()}>Close QRs</button>
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
    </div>
  </>
);

export default TablesManagerView;