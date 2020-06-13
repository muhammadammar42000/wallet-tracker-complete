var auth = firebase.auth();
var firestore = firebase.firestore();
var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");
var googleBtn = document.querySelector(".googleBtn");

var googleSignin = async() => {
    try {
        var googleProvider = new firebase.auth.GoogleAuthProvider();
        var {additionalUserInfo : {isNewUser} ,user:{displayName,uid,email}} = await firebase.auth().signInWithPopup(googleProvider)
        //if new user then store info in fire store
        if (isNewUser) {
                    //store user data in firestore
        var userInfo ={
            fullName: displayName,
            email,
            createdAt: new Date()
        }
        await firestore.collection("user").doc(uid).set(userInfo);
        console.log("done")
        //redirect
        location.assign(`./dashboard.html#${uid}`)
        } else {
            console.log("welcome")
        //redirect
        location.assign(`./dashboard.html#${uid}`)
        }


    } catch (error) {
        console.log(error)
    }
}
googleBtn.addEventListener("click", googleSignin)

var signinFormSubmission = async (e) => {
    e.preventDefault();
    try {
        var email = document.querySelector(".signinEmail").value;
    var password = document.querySelector(".signinPassword").value;
    if(email && password){
        //login user
        var {user: {uid}} = await auth.signInWithEmailAndPassword(email,password)
        //fetch user info
        var userInfo = await firestore.collection("user").doc(uid).get();
        console.log(userInfo.data())
        //redirect
        location.assign(`./dashboard.html#${uid}`)
        //"/dashboard.html#{uid}"
    }
    } catch (error) {
        console.log(error)
    }
}
var signupFormSubmission = async (e) => {
    e.preventDefault();
  try  { 
    var fullName = document.querySelector(".signupFullName").value;
    var email = document.querySelector(".signupEmail").value;
    var password = document.querySelector(".signupPassword").value;
    if(fullName && email && password){
        //create user in auth 
        var {user:{uid}} = await auth.createUserWithEmailAndPassword(email,password)
        console.log(uid)
        //store user data in firestore
        var userInfo ={
            fullName,
            email,
            createdAt: new Date()
        }
        console.log(userInfo)
        await firestore.collection("user").doc(uid).set(userInfo);
        console.log("done")
        //redirect
        location.assign(`./dashboard.html#${uid}`)
    }} catch(error){
        console.log(error);
    }
}
signinForm.addEventListener("submit" , (e) => signinFormSubmission(e));
signupForm.addEventListener("submit" , (e) => signupFormSubmission(e));
