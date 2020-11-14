import React, { Component } from 'react';
import '../../index.css';

export default class DashboardDemoModal extends Component {
  render() {
    return (
      <div className="demoModal_wide">
        <div className="demoModal_content">
          <div></div>

          <div className="demoModal_header">
            <h3>WELCOME TO DASH TABS!</h3>
            <h3>The dashboard is the core of dash tab's functionality and its split into three sections</h3>
          </div>
          <div>
            <div className="demoModal_infoColumn">
              <h4>ORDERS</h4>
              <div>
                <div>
                  See orders in real time.
                </div>
                <div>
                  Browse through past orders.
                </div>
                <div>
                  Check order info including items, total cost and the time the order was placed.
                </div>
              </div>
            </div>
            <div className="demoModal_infoColumn">
              <h4>TABLES</h4>
              <div>
                <div>
                  Add tables.
                </div>
                <div>
                  Generate and print individual QR code for each table.
                </div>
              </div>
            </div>
            <div className="demoModal_infoColumn">
              <h4>MENU</h4>
              <div>
                <div>
                  Input menu items with price, description and availability.
                </div>
                <div>
                  Changes in the menu will be reflected in business menu page.
                </div>
              </div>
            </div>
          </div>
          <h3>Try to place an order through the menu that opened in another tab. Then check the order in the dashboard.</h3>
        </div>
        <div>
          <div
            onClick={() => this.props.toggleModal()}
            className="btn"
            >
            LET ME TRY!
          </div>
        </div>
      </div>
    )
  }
}