import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();
  }

  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              isAnonymous: authUser.isAnonymous,
              ...dbUser,
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  doSignInAnonymously = () =>
    this.auth.signInAnonymously();

  // *** Cleanup DB ***

    // one cleanup function
    // INPUTS
    // time
    // db ref path
    // ref path function

  // *** Cleanup Orders ***
  cleanupDemoOrders = (time) => {
    let keysToDelete = [];
    this.db.ref(`orders/`).once('value').then(snapshot => { 
      let orders = snapshot.val(); 
      for(var key in orders) {
        if(orders[key].hasOwnProperty('timestamp')) {
          if(time-orders[key]["timestamp"] > 900000) { 
            keysToDelete.push(key); 
          }
        }
      };
    }).then(() => {
      for(let i=0; i<keysToDelete.length; i++) { 
        this.userOrders(keysToDelete[i]).remove();
      };
    });
  }

  // *** Cleanup Menu ***
  cleanupDemoMenus = (time) => {
    let keysToDelete = [];
    this.db.ref(`menus/`).once('value').then(snapshot => { 
      let menus = snapshot.val(); 
      for(var key in menus) {
        if(menus[key].hasOwnProperty('timestamp')) {
          if(time-menus[key]["timestamp"] > 900000) { 
            keysToDelete.push(key); 
          }
        }
      };
    }).then(() => {
      for(let i=0; i<keysToDelete.length; i++) { 
        this.userMenu(keysToDelete[i]).remove();
      };
    });
  }

  // *** Cleanup Users ***
  cleanupDemoUsers = (time) => {
    let keysToDelete = [];
    this.db.ref(`users/`).once('value').then(snapshot => { 
      let users = snapshot.val(); 
      for(var key in users) {
        if(users[key].hasOwnProperty('timestamp')) {
          if(time-users[key]["timestamp"] > 900000) { 
            keysToDelete.push(key); 
          }
        }
      };
    }).then(() => {
      for(let i=0; i<keysToDelete.length; i++) { 
        this.user(keysToDelete[i]).remove();
      };
    });
  }


  demoCleanupDb = () => {
    let currentTime = new Date().getTime();
    this.cleanupDemoOrders(currentTime);  
    this.cleanupDemoMenus(currentTime);  
    this.cleanupDemoUsers(currentTime);
  };

  // HACER ASYNC FUNCTION SI NO FUNCIONA
  getCurrentUserUid = () => this.auth.currentUser.uid;
  getCurrentUser = () => this.auth.currentUser;

  // *** User API ***
  userOrders = uid => this.db.ref(`orders/${uid}`);
  userMenu = uid => this.db.ref(`menus/${uid}`);
  userTables = uid => this.db.ref(`users/${uid}/tables`);
  user = uid => this.db.ref(`users/${uid}`);
  userBusinessName = uid => this.db.ref(`users/${uid}/businessName`);
  users = () => this.db.ref('users');
};

export default Firebase;