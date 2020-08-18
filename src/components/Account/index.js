import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import PasswordChangeForm from '../PasswordChange';

const AccountPage = (props) => {
  const [newBusinessName, setNewBusinessName] = useState('');

  useEffect(() => {
    props.firebase.user(props.firebase.getCurrentUserUid()).once('value', snapshot => {
      setNewBusinessName(snapshot.val().businessName);
    });
  }, []);

  const updateBusinessName = (businessName) => {
    props.firebase.userBusinessName(props.firebase.getCurrentUserUid()).set(businessName);
  }

  return (
    <AuthUserContext.Consumer>
      {authUser => (
        <div>
          <h1>Account: {authUser.email}</h1>
          <PasswordChangeForm />
          <label>Set new business name</label>
          <input 
            type="text"
            placeholder="New business name"
            value={newBusinessName}
            onChange={e => setNewBusinessName(e.target.value)}
          />
          <button disabled={newBusinessName === '' ? true : false} onClick={() => updateBusinessName(newBusinessName)}>Upgrade business name</button>
        </div>
      )}
    </AuthUserContext.Consumer>
  )
};


const condition = authUser => !!authUser;

// export default withAuthorization(condition)(AccountPage);

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AccountPage);