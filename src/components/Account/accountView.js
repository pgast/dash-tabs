import React from 'react';
import PasswordChangeForm from '../PasswordChange';
import './style.css';

const AccountView = ({ authUser, newBusinessName, setNewBusinessName, updateBusinessName }) => (
  <div className="accountView">
    <div className="dashboardHeader">
      <h1>ACCOUNT</h1>
    </div>
    <div>
      <h1>Account: {authUser.email}</h1>
      <PasswordChangeForm />
      <label>Set new business name</label>
      <input 
        type="text"
        value={newBusinessName}
        placeholder="New business name"
        onChange={e => setNewBusinessName(e.target.value)}
      />
      <button 
        disabled={newBusinessName === '' ? true : false} 
        onClick={() => updateBusinessName(newBusinessName)}
      >
        Upgrade business name
      </button>
    </div>
  </div>
);

export default AccountView;