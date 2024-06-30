// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCsi6d-ttdoRpqZ79yAMkIsMDN1ObR56Vw",
    authDomain: "positive-affirmations-6f4de.firebaseapp.com",
    projectId: "positive-affirmations-6f4de",
    storageBucket: "positive-affirmations-6f4de.appspot.com",
    messagingSenderId: "673466441825",
    appId: "1:673466441825:web:f55187a876022c1886ca20",
    measurementId: "G-ESWHMNTB6C"
  };
  firebase.initializeApp(firebaseConfig);
  
  var db = firebase.firestore();
  
  // Example function to get data from Firestore
  function getQuotes() {
    db.collection("quotes").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => ${doc.data().quote}`);
      });
    });
  }
  
  // Call the function to get data
  getQuotes();
  