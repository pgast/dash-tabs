import React from 'react';
import { withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const MobileModal = (props) => (
  <div className="demoModal_wide">
    <div className="demoModal_content">
      <div id="mobileModal">
        <p>
          The dashboard is currently not optimized for mobile usage.
        </p>
        <p>
          Please switch to a desktop computer to get the best experience.
        </p>
      </div>
    </div>
    <div>
      <div
        onClick={() => props.history.push(ROUTES.HOME)}
        className="btn"
        >
        GO BACK
      </div>
    </div>
  </div>
)

export default withRouter(MobileModal);