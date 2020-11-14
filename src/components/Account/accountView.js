import React from 'react';

import PasswordChangeForm from '../PasswordChange';
import './style.css';

const AccountView = ({ authUser, newBusinessName, setNewBusinessName, updateBusinessName }) => (
  <div className="accountView">
    <div className="dashboardHeader">
      <h1>ACCOUNT</h1>
    </div>
    <div className="accountForm">
      <div>
        <h3>LOGGED IN AS</h3>
        <h3>{authUser.email}</h3>
      </div>
      <PasswordChangeForm />
      <div>
        <h3>CHANGE BUSINESS NAME</h3>
        <div>
          <input 
            type="text"
            value={newBusinessName}
            onChange={e => setNewBusinessName(e.target.value)}
          />
          <div 
            className={newBusinessName === '' ? "btn btn_disabled" : "btn btn_secondary"}
            onClick={newBusinessName === '' ? null : () => updateBusinessName(newBusinessName)}
          >
            SAVE
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default AccountView;