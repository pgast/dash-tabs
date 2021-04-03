<!--![Banner](https://github.com/navendu-pottekkat/awesome-readme/blob/master/header.png) -->

# Dashtabs
![GitHub last commit](https://img.shields.io/github/last-commit/pgast/dash-tabs)

• QR based order management tool for food businesses.\
• Users scan generated QR code and are taken to an online menu fetched from a database.\
• Orders are placed through the mobile web app that displays the menu, items chosen and price.\
• Owners can see orders in real time, generate QR codes for tables and update menu items.

[**Try it now!**](http://bite-choice.herokuapp.com/) No need to register, there's a quick demo option.  

## Installation
[(Back to top)](#dashtabs)  
  
To use this project, first clone the repo on your device using the instructions below:
```bash
$ git clone https://github.com/pgast/dash-tabs.git
$ cd dash-tabs
$ npm install
```
Since the project is linked to my own firebase database you'll have to set up one for yourself. Create a .env file in the /src directory.
```bash
$ touch .env
```
Fill up the values with your own firebase config data.
```
REACT_APP_FIREBASE_KEY= XXXX
REACT_APP_FIREBASE_DOMAIN="[XXXX].firebaseapp.com"
REACT_APP_FIREBASE_DATABASE="https://[XXXX].firebaseio.com"
REACT_APP_FIREBASE_PROJECT_ID= [XXXX]
REACT_APP_FIREBASE_STORAGE_BUCKET="[XXXX].appspot.com"
REACT_APP_FIREBASE_SENDER_ID= XXXX
REACT_APP_FIREBASE_APP_ID= XXXX
REACT_APP_DEMO_EMAIL=[EMAIL]   <--- you will register this email user for the demo session
REACT_APP_DEMO_PWD=[PWD] <-- password for the email account you register for the demo session
REACT_APP_DEMO_UID= [XXXX]
```
Take a look at the demoData.js file located on the /constants folder. The file displays the data schema used by the backend and the application. 

## Available Scripts
[(Back to top)](#dashtabs)

To the react app run this script on the project root.
```bash
$ npm run start
```
The app will run locally on localhost:3000.

## Development
[(Back to top)](#dashtabs)

The app implements and handles:

+ Back-end NoSQL database with CRUD functionality.
+ User Authentication
+ User Authorization


## License  
[(Back to top)](#dashtabs)    
  
[MIT](https://choosealicense.com/licenses/mit/)
