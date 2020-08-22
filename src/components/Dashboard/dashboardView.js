import React from 'react';
import MenuManager from '../MenuManager';
import OrdersManager from '../OrdersManager';
import TablesManager from '../TablesManager';
import Modal from '../Modal';

const DashboardView = ({ 
  view,
  menu,
  tables,
  orders,
  loading,
  createQR,
  showModal,
  toggleView,
  toggleModal,
  updateMenuDb,
  updateOrdersDb,
  updateTablesDb,
}) => (
  <div className="dashboard">
    <div className="dashboard_header">
      <h3>Dashboard</h3>
      <div className="viewToggler">
        <h4 onClick={() => toggleView('orders')}>ORDERS</h4>
        <h4 onClick={() => toggleView('tables')}>TABLES</h4>
        <h4 onClick={() => toggleView('menu')}>MENU MANAGER</h4>
      </div>
    </div>
    {view === "orders" && <OrdersManager dbOrders={orders} updateOrdersDb={updateOrdersDb}/>}
    {view === "tables" && <TablesManager createQR={createQR} dbTables={tables} updateTablesDb={updateTablesDb}/>}
    {view === "menu" && <MenuManager menu={menu} updateMenuDb={updateMenuDb} />}
    {loading && <div>Loading ...</div>}
    <Modal toggleModal={toggleModal} show={showModal}>
      Message in Modal
    </Modal>
  </div>
);

export default DashboardView;