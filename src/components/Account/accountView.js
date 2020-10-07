import React from 'react';
import PasswordChangeForm from '../PasswordChange';
import './style.css';

const AccountView = ({ authUser, newBusinessName, setNewBusinessName, updateBusinessName }) => (
  <div className="accountView">
    <div className="dashboardHeader">
      <h1>ACCOUNT</h1>
    </div>
    <div>
      <div>
        <h3>Logged in as:</h3>
        <h3>{authUser.email}</h3>
      </div>
      <PasswordChangeForm />
      <div>
        <h3>Change business name</h3>
        <input 
          type="text"
          value={newBusinessName}
          onChange={e => setNewBusinessName(e.target.value)}
        />
        <div 
          className="btn btn_secondary"
          disabled={newBusinessName === '' ? true : false} 
          onClick={() => updateBusinessName(newBusinessName)}
        >
          Upgrade business name
        </div>
      </div>
    </div>
  </div>
);

export default AccountView;