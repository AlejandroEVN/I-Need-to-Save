document.addEventListener("DOMContentLoaded", () => {
    
    const debts = document.getElementById("debts");
    const food = document.getElementById("food");
    const groceries = document.getElementById("groceries");
    const leisure = document.getElementById("leisure");
    const other = document.getElementById("other");

    const categoriesList = [debts, food, groceries, leisure, other];

    categoriesList.forEach(category => {
        loadTransactionsInCategory(category.id).then(transactions => {
            const createdCategory = createTransactionCategoryElement(transactions, category);
            category.appendChild(createdCategory);
        });
    });
    
});

function createTransactionCategoryElement(transactions, category) {

    const transactionsTotalAmount = calculateTotalAmount(transactions);

    const transactionElement = document.createElement("div");

    transactionElement.className = `m-1`;

    transactionElement.innerHTML = ` 
    <div class="container-fluid">
        <span class="text-muted mr-2">Total</span><br>
        <span class="display-4">${transactionsTotalAmount.split(".")[0]}</span>
        <span class="align-top">¢${twoDecimals(transactionsTotalAmount.split(".")[1]) || ""}</span>
    </div> 
    <hr class="border-dark">
    <div class="container-fluid">
        <span class="text-muted">${capitalize(category.id)}</span>
        <img class="img-fluid float-right" src="./static/ints/icons/${category.id}-icon.png" />
    </div>
    `
    return transactionElement;
}

function calculateTotalAmount(transactions) {
    const totalAmount = transactions.reduce((totalAmount, transaction) => {
        return totalAmount + parseFloat(transaction.amount.slice(1));
    }, 0)
    return currencyUSD(totalAmount);
}

function currencyUSD(amount) {
    return `$${amount}`;
}

function capitalize(str) {
    return str.trim()[0].toUpperCase() + str.trim().slice(1);
}

function twoDecimals(num) {
    if (num === undefined || num === null) return 0;
    return num.slice(0,2);
}