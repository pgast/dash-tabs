import React, { Component } from 'react';
import './style.css';

export default class TableQRModal extends Component {
  render() {
    const singleQr = this.props.tablesQrCodes === null ? true : false;

    return (
      <div className={singleQr ? "tableModal" : "tableModal_wide"}>
        {singleQr && (
          <div>
            <h4>
              {this.props.qrSrc.table === "takeout" ? "TAKEOUT" : `TABLE #${this.props.qrSrc.table}`} CODE
            </h4>
            <img src={this.props.qrSrc.src} alt="" title="" />
          </div>
        )}

        {singleQr === false && (
          <>
            <div></div>
            <div>
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
          <div className="btn">
            PRINT
          </div>
          <div 
            onClick={e => this.props.toggleModal(e)}
            className="btn btn_secondary"
          >
            CLOSE
          </div>
        </div>
      </div>
    );
  };
}