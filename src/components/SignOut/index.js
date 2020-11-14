import React, { useContext } from 'react';

import { Store } from '../../store';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const SignOutButton = ({ firebase, userIsAnonymous, history }) => {
  const { dispatch } = useContext(Store);
  const toggleView = view => dispatch({ type: 'TOGGLE_VIEW', payload: view });

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
    toggleView('orders');
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
