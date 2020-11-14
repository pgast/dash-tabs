import React, { useContext } from 'react';

import Modal from '../Modals';
import { Store } from '../../store';
import MenuManager from '../MenuManager';
import OrdersManager from '../OrdersManager';
import TablesManager from '../TablesManager';
import MobileModal from '../Modals/MobileModal';
import DashboardDemoModal from '../Modals/DashboardDemoModal';

const DashboardView = ({ 
  menu,
  tables,
  orders,
  loading,
  isMobile,
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
      <Modal show={showModal}>
        {isMobile ? 
          <MobileModal />
          :
          <DashboardDemoModal toggleModal={toggleModal} />
        }
      </Modal>
    </div>
  );
};

export default DashboardView;