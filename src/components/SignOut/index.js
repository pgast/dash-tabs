import React from 'react';

import { withFirebase } from '../Firebase';

const SignOutButton = ({ firebase, authUser }) => (
  <button type="button" onClick={() => firebase.doSignOut(authUser)}>
    Sign Out
  </button>
);

export default withFirebase(SignOutButton);
