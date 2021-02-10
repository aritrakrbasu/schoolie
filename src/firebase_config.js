import firebase from 'firebase';
import 'firebase/firestore'
import 'firebase/storage'
//put all your firbase details below
	const config = {
    apiKey: "AIzaSyCcJiXalqUYLZbosNWy3dVSYmnTgbxJFIE",
    authDomain: "schoolie2020.firebaseapp.com",
    databaseURL: "https://schoolie2020.firebaseio.com",
    projectId: "schoolie2020",
    storageBucket: "schoolie2020.appspot.com",
    messagingSenderId: "60129917016",
    appId: "1:60129917016:web:d3500cd14a006aa61f322d",
    measurementId: "G-0S69MYR0VB"
      };
    export const fire=firebase.initializeApp(config);
    export const db=firebase.firestore();
    export const storage = firebase.storage();
    export const timestamp=firebase.firestore.FieldValue.serverTimestamp();
    export const feild_value=firebase.firestore.FieldValue;
    export const provider = new firebase.auth.GoogleAuthProvider();

    export default firebase; 