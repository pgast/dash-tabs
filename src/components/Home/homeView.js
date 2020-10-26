import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faReceipt, 
  faMobileAlt, 
  faStream,
  faQrcode,
  faUserFriends,
  faHamburger,
  faChartBar,
} from '@fortawesome/free-solid-svg-icons';
import './style.css';

const HomeView = ({ launchDemo, signUpRoute }) => (
  <div className="homeView">
    <div className="introRow">
      <div>
        <FontAwesomeIcon icon={faReceipt} size="8x" />
      </div>
      <div>
        <h1>WELCOME TO DASHTABS.</h1>
        <p>SDLFKJS sfdl ke lsdj sel sdlfk es ldfse lsdf sel dlkfjs ea adflkse lma e m ald es; ds</p>
        {/* <Link to={signUpRoute}>CREATE ACCOUNT</Link> */}
        <div className="btn" onClick={() => launchDemo()}>TRY IT NOW!</div>
      </div>
    </div>

    <div className="firstRow">
      <div>
        <h3>FIRST ROW</h3>
      </div>
      <div>
        <span className="fa-layers">
          <FontAwesomeIcon icon={faQrcode} size="3x" />
          <FontAwesomeIcon icon={faMobileAlt} size="10x" />
        </span>
      </div>
    </div>

    <div className="secondRow">
      <div>
        <FontAwesomeIcon icon={faStream} size="10x" />
      </div>
      <div>
        <h3>SECOND ROW</h3>
      </div>
    </div>

    <div className="benefitsRow">
      <div>
        <FontAwesomeIcon icon={faUserFriends} />
        FirstBenefit
      </div>
      <div>
        <FontAwesomeIcon icon={faChartBar} />
        Second Benefit
      </div>
      <div>
        <FontAwesomeIcon icon={faHamburger} />
        Third Benefit
      </div>
    </div>

    <div className="footer">
      <h3>FOOTER</h3>
    </div>
  </div>
);

export default HomeView;