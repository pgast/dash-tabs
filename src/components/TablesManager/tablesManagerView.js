import React from 'react';

import Modal from '../Modals';
import { TableCard } from '../Cards';
import TablesSideboard from './tablesSideboard';
import TableQRModal from '../Modals/TableQRModal';

const TablesManagerView = ({
  error,
  qrSrc,
  tables,
  addTable,
  showModal,
  tableEdit,
  editTable,
  inputTable,
  toggleModal,
  deleteTable,
  setTableEdit,
  tablesIsEmpty,
  tablesQrCodes,
  editIsInvalid,
  saveEditTable,
  setInputTable,
  sideboardView,
  inputIsInvalid,
  cancelAddTable,
  cancelTableEdit,
  toggleAddTableForm
}) => (
  <div className="viewSmall">
    <div className="dashboardHeader">
      <h1>TABLES</h1>
    </div>
    <div className="tableCardsView">
      
      {error && <h4>{error.msg}</h4>}

      {tablesIsEmpty ?
        <h3>NO TABLES REGISTERED</h3>
        :
        <>
          {tables.map((el, idx) => (
            <TableCard 
              key={idx}
              idx={idx}
              table={el}
              editTable={editTable}
              isSelected={tableEdit.current === idx}
            />
          ))}
        </>
      }
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
        cancelAddTable={cancelAddTable}
        cancelTableEdit={cancelTableEdit}
        toggleAddTableForm={toggleAddTableForm}
      />
    </div>
    <Modal toggleModal={toggleModal} show={showModal}>
      <TableQRModal qrSrc={qrSrc} tablesQrCodes={tablesQrCodes} toggleModal={toggleModal}/>
    </Modal>
  </div>
);

export default TablesManagerView;