$(document).ready(function () {

  // Add Firebase to HealthyGorillaApp web app
  var firebaseConfig = {
    apiKey: "AIzaSyCPIfGudl6LOhVtt2vIM-lDUTdHa33WPLI",
    authDomain: "healthygorilla.firebaseapp.com",
    databaseURL: "https://healthygorilla.firebaseio.com",
    projectId: "healthygorilla",
    storageBucket: "healthygorilla.appspot.com",
    messagingSenderId: "977887423528",
    appId: "1:977887423528:web:c9dbade3d29fb137"
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Function to handle new user registration
  function handleUserRegistration() {
    // Grab user information from DOM
    var email = $("#register_email").val();
    var password = $("#register_password").val();
    var displayName = $("#register_name").val();
    // Make sure user enters email address
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    // Make sure password is over 4 characters long
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Create new user with user email and password and check for firebase errors
    user = firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function (user) {
        var uid = user.uid;
        // Save user info to firebase database
        firebase.database().ref('users/' + uid).set({
          displayName: displayName,
          email: email
        });
        // Save user info to local storage
        setLocalStorge(displayName, email, uid);
        console.log(user);
        greetUser(displayName);
        // Handle Errors here.
      }).catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        // Allow for firebase to check password weakness
        if (errorCode == 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      });
    // Hide registration modal --** Doesn't quite work yet
    $('.modal').hide();
  }

  // Function event to handle user sign out
  function handleUserSignOut() {
    firebase.auth().signOut().then(function () {
      $('#login-modal').css('display:none');
      console.log("Logged out!");
      // Clear absolutely everything stored in localStorage using localStorage.clear()
      localStorage.clear();
      location.reload(true);
      $("#signInBtn").show();
    });
  }

  // Functione event to handle user login
  function handleUserLogIn() {
    var email = $("#login_email").val().trim();
    var password = $("#login_password").val().trim();
    var user = firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function (user) {
        getUserData();
        return user;
      }).catch(function (error) {
        if (error.code === "auth/invalid-email") {
          $('#login-modal').modal('open');
          alert("Incorrect email format.");
          console.log(error.code);
          console.log(error.message);
          return;
        }
        if (error.code === "auth/user-not-found") {
          $('#login-modal').modal('open');
          alert("Invalid email or password");
          console.log(error.code);
          console.log(error.message);
          return;
        }
      });
    $('#login-modal').modal('close');
    $("#signInBtn").hide();
    $("#signOutBtn").show();
    return user;
  }

  // Function that finds user data 
  function getUserData() {
    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function (snapshot) {
      var displayName = (snapshot.val() && snapshot.val().displayName);
      var userEmail = (snapshot.val() && snapshot.val().email);
      console.log(displayName);
      console.log(userEmail);
      greetUser(displayName);
      setLocalStorge(displayName, userEmail, userId);
    });
  }

  // Function that changes HTML when user is signed in
  function greetUser(displayName) {
    $("#helloName").show();
    $("#helloName").html("<h2>Hello " + displayName + "!</h2>"); // works after refresh if user didn't sign out
    $("#signInBtn").hide();
    $("#signOutBtn").show();
  }

  // Function to set local storaage
  function setLocalStorge(displayName, email, uid) {
    localStorage.setItem("displayName", displayName);
    localStorage.setItem("email", email);
    localStorage.setItem("uid", uid);
    console.log(displayName, email, uid);
  }

  // Functiont hat initiates app by checking if a user logged in.
  function checkIfSignedIn() {
    var isSignedin = localStorage.getItem('displayName');
    console.log(isSignedin);
    if (isSignedin) {
      greetUser(isSignedin);
    } else {
      console.log("No user is logged in");
      localStorage.clear();
      $("#signInBtn").show();
    }
  }

  // Start APP by checking if user is signed in on onlaod
  checkIfSignedIn();


  //  ** EVENTS **

  // Event handler for new user registration submit
  $("#register-btn").on("click", function (event) {
    event.preventDefault();
    handleUserRegistration();
  });

  // Event handler for signing out user
  $("#signOutBtn").on("click", function (event) {
    event.preventDefault();
    handleUserSignOut();
  });

  // Event handler for logging in user
  $("#login-btn").on("click", function (event) {
    event.preventDefault();
    handleUserLogIn();
  });

});