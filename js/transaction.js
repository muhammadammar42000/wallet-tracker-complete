var firestore = firebase.firestore();
var auth = firebase.auth();
var transactionId = location.hash.substring(1,location.hash.length)

var transactionForm = document.querySelector(".transactionForm");

var transactionTitle = document.querySelector(".title")
var transactionCost = document.querySelector(".cost")
var transactionType = document.querySelector(".transactionType")
var transactionAt = document.querySelector(".transactionAt")


var fetchTransaction = async (transactionId) => {
    try {//fetch transaction
    var transaction = await firestore
    .collection("transaction")
    .doc(transactionId)
    .get();
    return transaction.data();}
    catch(error){
        console.log(error)
    }
}

var editFormHandler = async (e, transactionId) => {
    e.preventDefault()
    try{var updatedTitle = transactionTitle.value;
    var updatedCost = transactionCost.value;
    var updatedType = transactionType.value;
    var updatedTransactionAt = transactionAt.value;
    console.log(updatedTitle,updatedCost,updatedType,updatedTransactionAt)
    var updatedTransaction = {
        title: updatedTitle,
        cost: parseInt(updatedCost),
        transactionType: updatedType,
        transactionAt: new Date(updatedTransactionAt)
    }
    await firestore
    .collection("transaction")
    .doc(transactionId)
    .update(updatedTransaction)
    location.assign("./dashboard.html")

}
    catch(error){
        console.log(error)
    }
}
//listners
transactionForm.addEventListener("submit",(e) => editFormHandler(e,transactionId))

//auth listner
auth.onAuthStateChanged(async (user) => {
    if (user) {
        //form initial value handling
        var {
            title,
            cost,
            transactionType: transType,
            transactionAt: transAt
        } = await fetchTransaction(transactionId)
        //setting initail values
        transactionTitle.value = title;
        transactionCost.value = cost;
        transactionType.value = transType;
        transactionAt.value = transAt.toDate().toISOString().split("T")[0];
    } else {
        location.assign("./index.html")

    }
});