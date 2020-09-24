import React, { useContext } from 'react';
import MenuManager from '../MenuManager';
import OrdersManager from '../OrdersManager';
import TablesManager from '../TablesManager';
import Modal from '../Modals';
import DashboardDemoModal from '../Modals/DashboardDemoModal';
import { Store } from '../../store';

const DashboardView = ({ 
  menu,
  tables,
  orders,
  loading,
  createQR,
  showModal,
  toggleModal,
  updateMenuDb,
  updateOrdersDb,
  updateTablesDb,
}) => {
  const { state } = useContext(Store);

  return (
    <div className="dashboardFull">
      {state.view === "orders" && 
        <OrdersManager 
          dbOrders={orders} 
          updateOrdersDb={updateOrdersDb}
        />
      }
      {state.view === "tables" && 
        <TablesManager 
          dbTables={tables} 
          createQR={createQR} 
          updateTablesDb={updateTablesDb}
        />
      }
      {state.view === "menu" && 
        <MenuManager 
          menu={menu} 
          updateMenuDb={updateMenuDb} 
        />
        }
      {loading && <div>Loading ...</div>}
      <Modal toggleModal={toggleModal} show={showModal}>
        <DashboardDemoModal />
      </Modal>
    </div>
  );
};

export default DashboardView;