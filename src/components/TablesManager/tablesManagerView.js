import React from 'react';
import TablesSideboard from './tablesSideboard';
import { TableCard } from '../Cards';
import Modal from '../Modals';
import TableQRModal from '../Modals/TableQRModal';

const TablesManagerView = ({
  error,
  tables,
  addTable,
  showModal,
  tableEdit,
  displayQr,
  editTable,
  inputTable,
  toggleModal,
  deleteTable,
  setTableEdit,
  tablesIsEmpty,
  editIsInvalid,
  saveEditTable,
  setInputTable,
  sideboardView,
  inputIsInvalid,
  resetTableEdit,
  toggleAddTableForm,
}) => (
  <div className="viewSmall">
    <div className="dashboardHeader">
      <h1>TABLES</h1>
    </div>
    <div className="tableCardsView">
      {error && <h4>{error.msg}</h4>}

      <div className="tableCards_items">
        {tablesIsEmpty ?
          <h3>NO TABLES REGISTERED</h3>
          :
          <ol>
            {tables.map((el, idx) => (
              <TableCard 
                key={idx}
                idx={idx}
                table={el}
                editTable={editTable}
                isSelected={tableEdit.current === idx}
              />
            ))}
          </ol>
        }
      </div>

      {/* <div>
        <button onClick={(e) => generateSingleQr(null, e, 'takeout', true)}>Get Takeout QR</button>
        {(displayQr.src !== null && displayQr.current === 'takeout') &&
          <>
            <h5>Takeout</h5>
            <img src={displayQr.src} alt="" title="" />
          </>
        }
      </div>
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
      } */}

    </div>
    <div className="fixedSideboard">
      <TablesSideboard 
        addTable={addTable}
        tableEdit={tableEdit}
        inputTable={inputTable}
        deleteTable={deleteTable}
        toggleModal={toggleModal}
        setTableEdit={setTableEdit}
        sideboardView={sideboardView}
        setInputTable={setInputTable}
        saveEditTable={saveEditTable}
        editIsInvalid={editIsInvalid}
        inputIsInvalid={inputIsInvalid}
        resetTableEdit={resetTableEdit}
        toggleAddTableForm={toggleAddTableForm}
      />
    </div>
    <Modal toggleModal={toggleModal} show={showModal}>
      <TableQRModal displayQr={displayQr} />
    </Modal>
  </div>
);

export default TablesManagerView;