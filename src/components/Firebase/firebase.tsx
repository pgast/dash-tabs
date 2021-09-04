import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

interface Table {
  description: string,
  number: number,
  waitingOrder: boolean
}

export interface User {
  businessName: string,
  email: string,
  username: string,
  tables: Table[],
  once?: (val: string, func: any) => void
}

interface MenuItem {
  available: boolean,
  description: string,
  name: string,
  price: number
}

interface Menu {
  dishes: MenuItem[],
  drinks: MenuItem[]
}

type Menus = Menu[]

interface OrderItem {
  name: string,
  qty: number
}

interface CurrentOrder {
  comments: string,
  cost: number,
  items: OrderItem[],
  orderNum: number,
  ready: boolean,
  start: number,
  table: string
}

interface PastOrder extends CurrentOrder {
  end: number
}

interface UserOrders {
  current: CurrentOrder[],
  past: PastOrder[],
}

type DatabaseOrders = UserOrders[];

interface ConfigType {
  apiKey: string,
  appId: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  messagingSenderId: string,
  storageBucket: string,
}

const config: ConfigType = {
  apiKey: process.env.REACT_APP_FIREBASE_KEY,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  authDomain: process.env.REACT_APP_FIREBASE_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
  }
  // Auth API
  doCreateUserWithEmailAndPassword = (email: string, password: string): void =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: string, password: string): void =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = (): void => this.auth.signOut();

  doPasswordReset = (email: string): void => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password: string): void =>
    this.auth.currentUser.updatePassword(password);

  // Merge Auth and DB User API
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

  // Cleanup Orders
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

  // Cleanup Menu
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

  // Cleanup Users
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

  getCurrentUserUid = () => this.auth.currentUser.uid;
  getCurrentUser = () => this.auth.currentUser;

  // User API
  users = (): User[] => this.db.ref('users');
  user = (uid: string): User => this.db.ref(`users/${uid}`);
  userMenu = (uid: string): Menu => this.db.ref(`menus/${uid}`);
  userOrders = (uid: string): UserOrders => this.db.ref(`orders/${uid}`);
  userTables = (uid: string): Table[]=> this.db.ref(`users/${uid}/tables`);
  userBusinessName = (uid: string): string=> this.db.ref(`users/${uid}/businessName`);
};

export default Firebase;