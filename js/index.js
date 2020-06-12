var auth = firebase.auth();
var firestore = firebase.firestore();

var signinForm = document.querySelector(".signinForm");
var signupForm = document.querySelector(".signupForm");

var signinFormSubmission = (e) => {
    e.preventDefault();
    var email = document.querySelector(".signinEmail").value;
    var password = document.querySelector(".signinPassword").value;
    console.log(email);
    console.log(password);
}
var signupFormSubmission = (e) => {
    e.preventDefault(); 
    var fullName = document.querySelector(".signupFullName").value;
    var email = document.querySelector(".signupEmail").value;
    var password = document.querySelector(".signupPassword").value;
    console.log(fullName, email , password);
}
signinForm.addEventListener("submit" , (e) => signinFormSubmission(e));
signupForm.addEventListener("submit" , (e) => signupFormSubmission(e));