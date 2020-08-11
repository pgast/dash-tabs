import React from 'react';
import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase, userIsAnonymous, history }) => {
  const stopWatchingDbChanges = () => {
    firebase.users().off();
    firebase.userOrders().off();
    firebase.userMenu().off();
    console.log('1')
    return Promise.resolve();
  };

  const deleteAnonDb = (uid) => {
    firebase.user(uid).remove();
    firebase.userMenu(uid).remove();
    firebase.userOrders(uid).remove();
    console.log('2');
    return Promise.resolve();
  }

  const handleLogout = async () => {
    if(userIsAnonymous) {
      let anonUid = firebase.getCurrentUserUid();
      stopWatchingDbChanges()
        .then(() => {
          deleteAnonDb(anonUid);
        })
        .then(() => {
          console.log('3');
          history.push(ROUTES.HOME);
          firebase.doSignOut();
        });
    } else {
      firebase.doSignOut();
    }
  }

  return (
    <button type="button" onClick={() => handleLogout()}>
      Sign Out
    </button>
  )
};

export default withFirebase(SignOutButton);
