import React, { Component } from 'react';
import printJS from 'print-js';

import './style.css';

export default class TableQRModal extends Component {
  render() {
    const singleQr = this.props.tablesQrCodes === null ? true : false
    return (
      <div className={singleQr ? "tableModal" : "tableModal_wide"}>
        {singleQr && (
          <div id="printjs-qr">
            <h4>
              {this.props.qrSrc.table === "takeout" ? "TAKEOUT" : `TABLE #${this.props.qrSrc.table}`} CODE
            </h4>
            <img src={this.props.qrSrc.src} alt="" title="" />
          </div>
        )}

        {singleQr === false && (
          <>
            <div></div>
            <div id="printjs-qr">
              {this.props.tablesQrCodes.map((el, idx) => (
                <div key={idx}>
                  <h4>
                    {el.number === "takeout" ? "TAKEOUT" : `TABLE #${el.number}`} CODE
                  </h4>
                  <img src={el.qr} alt="" title="" />
                </div>
              ))}
            </div>
          </>
        )}

        <div>
          <div className="btn" onClick={() => printJS('printjs-qr', 'html')}>
            PRINT
          </div>
          <div 
            onClick={() => this.props.toggleModal()}
            className="btn btn_secondary"
          >
            CLOSE
          </div>
        </div>
      </div>
    );
  };
}