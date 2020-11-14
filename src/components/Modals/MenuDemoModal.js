import React, { Component } from 'react';

import '../../index.css';
import './style.css';

export default class MenuDemoModal extends Component {
  render() {
    return (
      <div className="demoMenuModal">
        <div>
          <h3>READY TO ORDER?</h3>
          <h3>Keep this tab open and switch to the previous opened tab to get an overview of the functions. When you are ready, switch back here.</h3>
          <p>
            Users will see the menu of your restaurant through this screen. From here, they can add items, change quantities and place their order.
          </p>
          <p>
            Try resizing the window to mobile size or better yet, head to the dashboard on the other tab and scan a QR code from your own cellphone.
          </p>
        </div>
        <div>
          <div 
            onClick={() => this.props.toggleModal()}
            className="btn"
            >
            GOT IT!
          </div>
        </div>
      </div>
    )
  }
}