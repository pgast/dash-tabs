import React from 'react';
import PasswordChangeForm from '../PasswordChange';

const AccountView = ({ authUser, newBusinessName, setNewBusinessName, updateBusinessName }) => (
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
);

export default AccountView;