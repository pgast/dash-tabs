import React, { Component } from 'react';
import '../../index.css';

export default class TableQRModal extends Component {
  render() {
    return (
      <div onClick={() => console.log(this.props.displayQr)}>
        Table qrs MODAL
        <img src={this.props.displayQr.src} alt="" title="" />
      </div>
    )
  }
}