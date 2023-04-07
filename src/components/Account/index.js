import React, { useState, useEffect } from 'react';
import { compose } from 'react-recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import AccountView from './accountView';

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
        <AccountView 
          authUser={authUser} 
          newBusinessName={newBusinessName} 
          setNewBusinessName={setNewBusinessName} 
          updateBusinessName={updateBusinessName}
        />
      )}
    </AuthUserContext.Consumer>
  )
};

const condition = authUser => !!authUser;

export default compose(
  withAuthorization(condition),
  withFirebase,
)(AccountPage);