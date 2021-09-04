import React, { useState, useEffect } from 'react';
import { compose } from 'recompose';

import { withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';
import AccountView from './accountView';
import { User } from '../Firebase/firebase';

interface Props {
  firebase: {
    getCurrentUserUid: () => string,
    user: (uid: string) => User,
    userBusinessName: (uid: string) => string,
  }
}

const AccountPage = (props: Props) => {
  const [newBusinessName, setNewBusinessName] = useState<string>('');

  useEffect(() => {
    props.firebase.user(props.firebase.getCurrentUserUid()).once('value', snapshot => {
      setNewBusinessName(snapshot.val().businessName);
    });
  }, []);

  const updateBusinessName = (businessName: string): void => {
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