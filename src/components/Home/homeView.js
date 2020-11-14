import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStream,
  faQrcode,
  faReceipt, 
  faChartBar,
  faHamburger,
  faMobileAlt, 
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';

import './style.css';

const HomeView = ({ launchDemo, signUpRoute, signInRoute }) => (
  <div className="homeView">
    <div className="mobileHomeHeader">
      <div className="btn">
        <Link style={{ textDecoration: 'none', color: 'white' }} to={signInRoute}>SIGN IN</Link>
      </div>
    </div>
    <div className="introRow">
      <div>
        <FontAwesomeIcon icon={faReceipt} size="9x"/>
      </div>
      <div>
        <h1>WELCOME TO DASHTABS.</h1>
        <p>Optimized order management for the food business industry.</p>
        <div className="btn" onClick={() => launchDemo()}>TRY IT NOW!</div>
      </div>
    </div>
    <div className="firstRow">
      <div>
        <div id="rowText">
          <p>
            Generate your own QR codes.
          </p>
          <p>
            Users scan the code and get an interactive version of your menu.
          </p>
          <p>
            They input their items directly and send the order through the interactive interface.
          </p>
        </div>
      </div>
      <div>
        <span className="qrIcons">
          <FontAwesomeIcon icon={faMobileAlt} size="10x" />
          <FontAwesomeIcon icon={faQrcode} size="4x" id="qrIcon" />
        </span>
      </div>
    </div>
    <div className="secondRow">
      <div>
        <FontAwesomeIcon icon={faStream} size="8x" />
      </div>
      <div>
        <div id="rowText">
          <p>
            Keep track of orders in real time.
          </p>
          <p>
            Browse through past orders.
          </p>
          <p>
            See essential order info, items, total cost and time the order was placed.
          </p>
        </div>
      </div>
    </div>
    <div className="benefitsRow">
      <div>
        <FontAwesomeIcon icon={faUserFriends} size="5x"/>
        <p>
          No physical menus and less waiting staff.
        </p>
      </div>
      <div>
        <FontAwesomeIcon icon={faChartBar} size="5x" />
        <p>
          Track the completion time for every order.
        </p>
      </div>
      <div>
        <FontAwesomeIcon icon={faHamburger} size="5x" />
        <p>
          Changes in menu? Update in real time.
        </p>
      </div>
    </div>
    <div className="lastRow">
      <div className="btn" onClick={() => launchDemo()}>TRY IT NOW!</div>
      <p>or</p>
      <div className="btn">
        <Link 
          style={{ textDecoration: 'none', color: 'white' }}
          to={signUpRoute}
        >
            CREATE ACCOUNT
          </Link>
      </div>
    </div>
    <div className="footer">
      <div style={{
          opacity: 0.3,
          fontSize: 15,
          fontWeight: 'bold',
          textAlign: 'center',
          alignItems: 'center',
        }}
      >
        <a 
          style={{ 'textDecoration': 'none', 'color': "gray" }} 
          href="http://www.github.com/pgast" 
        >
          &lt;/&gt; pgast
        </a>
      </div>
    </div>
  </div>
);

export default HomeView;