import React, { Component } from 'react';
import '../../index.css';

export default class DashboardDemoModal extends Component {
  render() {
    let showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    return (
      <div>
        DASHBOARD DEMO MODAL
      </div>
    )
  }
}