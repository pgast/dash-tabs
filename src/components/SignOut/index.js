import React from 'react';
import * as ROUTES from '../../constants/routes';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase, userIsAnonymous, history }) => {
  const stopWatchingDbChanges = () => {
    firebase.users().off();
    firebase.userOrders().off();
    firebase.userMenu().off();
    return Promise.resolve();
  };

  const deleteAnonDb = (uid) => {
    firebase.user(uid).remove();
    firebase.userMenu(uid).remove();
    firebase.userOrders(uid).remove();
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
          history.push(ROUTES.HOME);
          firebase.doSignOut();
        });
    } else {
      firebase.doSignOut();
    }
  }

  return (
    <div onClick={() => handleLogout()}>
      SIGN OUT
    </div>
  )
};

export default withFirebase(SignOutButton);
