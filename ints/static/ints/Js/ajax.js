async function loadTransactionsInCategory(category) {
    const response = await fetch(`transactions/${category}`);
    const transactions = await response.json();

    return transactions;
}

async function loadTransactionsWithFilters(filters) {
    const response = await fetch(`all`, {
        method: "POST",
        body: JSON.stringify(filters)
    });
    const transactions = await response.json();
    
    return transactions;
}

async function loadTransactions(topFive = "") {
    const response = await fetch(`charts/data`, {
        method: "POST",
        body: JSON.stringify(topFive)
    });
    const transactions = await response.json();

    return transactions;
}
async function submitAvatarURL(avatarURL) {
    const response = await fetch(`profile/avatar/edit`, {
        method: "PUT",
        body: JSON.stringify(avatarURL)
    });
    const result = await response.json();

    return result;
}

async function submitNewUsername(newUsername) {
    const response = await fetch(`profile/username/edit`, {
        method: "PUT",
        body: JSON.stringify(newUsername)
    });
    const result = await response.json();

    return result;
}

async function loadTransactionsInYear(year) {
    const response = await fetch(`charts/transactions/${year}`);
    const transactions = await response.json();
    
    return transactions;
}

async function deleteTransactionWithId(id) {
    const response = await fetch(`all/delete`, {
        method: "DELETE",
        body: JSON.stringify(id)
    });
    const result = await response.json();

    return result;
}

async function getTransactionsCount() {
    const response = await fetch('all/count');
    const count = await response.json();

    return count;
}