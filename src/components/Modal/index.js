import React, { Component } from "react";
import '../../index.css';


export default class Modal extends Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };

  render() {
    let showHideClassName = this.props.show ? "modal display-block" : "modal display-none";

    return (
      <div className={showHideClassName}>
        <div className="modal-main">
          <div>{this.props.children}</div>
            <div>
              <button onClick={e => {this.onClose(e)}}>
                Close
              </button>
            </div>
        </div>
      </div>
    )
  }
}