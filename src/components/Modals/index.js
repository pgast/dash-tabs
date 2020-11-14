import React, { Component } from "react";

import '../../index.css';

export default class Modal extends Component {
  render() {
    let showHideClassName = this.props.show ? "modal display-block" : "modal display-none";
    return (
      <div className={showHideClassName}>
        {this.props.children}
      </div>
    )
  }
}
