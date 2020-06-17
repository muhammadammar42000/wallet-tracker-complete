var firestore = firebase.firestore();
var auth = firebase.auth();
var nameDiv = document.querySelector(".name h4");
var signoutBtn = document.querySelector(".signoutBtn")
var transactionList = document.querySelector(".transactionList")
//fteching user id form url
var uid = null;
// // console.log(data.createdAt.toDate().toISOString().split("T")[0]);

var transactionForm = document.querySelector(".transactionForm");

var renderTransactions = (transactionArr) => {
            //setting user current amount
            finalCostCalculation(transactionArr);
            //display all transactions
    transactionList.innerHTML= ""
    transactionArr.forEach((transaction,index) =>{
        var {title,cost,transactionAt,transactionId,transactionType }=transaction;
        transactionList.insertAdjacentHTML('beforeend',
        `<div class='transactionListItem ${transactionType === "income" ? "income" : "expense"}'>
        <div class="renderIndex listItem">
          <h3>${++index}</h3>
        </div>
        <div class="renderTitle listItem">
          <h3>${title}</h3>
        </div>
        <div class="renderCost listItem">
          <h3>${cost}</h3>
        </div>
        <div class="renderTransactionAt listItem">
          <h3>${transactionAt.toDate().toISOString().split("T")[0]}</h3>
        </div>
        <div class="renderTransactionAt listItem">
        <a href="./transaction.html#${transactionId}"><button type="button">view</buttom></a>
        </div>
      </div>`
      );
    })

}

var userSignout = async () =>{
    await auth.signOut()
}

var fetchUserInfo = async (uid) =>  {
    try {
        var userInfo = await firestore.collection("user").doc(uid).get();
        return userInfo.data();
        
        
    } catch (error) {
        console.log(error);
    }
};

var transactionFormSubmission = async (e) => {
    e.preventDefault();
    try {
        var title = document.querySelector(".title").value;
        var cost = document.querySelector(".cost").value;
        var transactionType = document.querySelector(".transactionType").value;
        var transactionAt = document.querySelector(".transactionAt").value;
        if(title && cost && transactionType && transactionAt){
            var transactionObj = {
                title,
                cost: parseInt(cost),
                transactionType,
                transactionAt: new Date(transactionAt),
                transactionBy : uid
            }
            await firestore.collection("transaction").add(transactionObj)
            //render fresh transactions
            //fetch users transaction
        var transactions = await fetchTransaction(uid);
        //render process
    renderTransactions(transactions);
        }
    } catch (error) {
        console.log(error)
    }
}

var finalCostCalculation = (transArr) => {
    var amountDiv =document.querySelector(".amount h3")
    var totalAmount = 0;
    transArr.forEach((transaction) => {
        var {cost , transactionType} = transaction;
        if(transactionType === "income"){
            totalAmount = totalAmount + cost
        }else{
            totalAmount = totalAmount - cost
        }
    })
    console.log(totalAmount)
    amountDiv.textContent = `${totalAmount} RS`
}


var fetchTransaction = async (uid) => {
    var transactions = [];
    var query = await firestore
    .collection("transaction")
    .where("transactionBy","==",uid)
    .orderBy("transactionAt","desc")
    .get();
    query.forEach((doc) => {
        transactions.push({...doc.data(),transactionId: doc.id})
    })
    return transactions
}


// fetchUserInfo(uid);

signoutBtn.addEventListener("click" , userSignout);

transactionForm.addEventListener("submit",(e) => transactionFormSubmission(e))

//auth listner
auth.onAuthStateChanged(async (user) => {
    if (user) {
        uid = user.uid;
        var userInfo = await fetchUserInfo(uid);
        console.log(userInfo)
        //setting user info
        //name
        nameDiv.textContent = userInfo.fullName;
        //render transaction   
        //fetch users transaction
        var transactions = await fetchTransaction(uid);
        //render process
        // console.log(transactions)
    renderTransactions(transactions);
    } else {
        location.assign("./index.html")

    }
})