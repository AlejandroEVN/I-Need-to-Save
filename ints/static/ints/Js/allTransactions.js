document.addEventListener("DOMContentLoaded", () => {
    const pagination_buttons = document.querySelectorAll(".pagination-link");
    const dateFilter = document.querySelector("#date-order-filter");
    const perPageFilter = document.querySelector("#items-per-page");
    const filterByMonth = document.querySelector("#month-filter");
    const categoryFilter = document.querySelector("#category-filter");

    let filters = {
        page: 1,
        date: dateFilter.value,
        perPage: perPageFilter.value,
        month: filterByMonth.value,
        category: categoryFilter.value
    }

    pagination_buttons.forEach(button => {
        button.addEventListener("click", () => {
            filters["page"] = button.dataset.page;
            generateHTML(filters);
        });
    });

    handleEventListener(dateFilter, filters, "date");
    handleEventListener(perPageFilter, filters, "perPage");
    handleEventListener(filterByMonth, filters, "month");
    handleEventListener(categoryFilter, filters, "category");

    generateHTML(filters);
    
});

function handleEventListener(element, filters, filterToChange) {
    element.addEventListener("change", () => {
        filters[filterToChange] = element.value;
        generateHTML(filters);
    });
}

function generateHTML(filters) {
    generatePaginationLinks(filters);
    
    const tableBody = document.getElementById("table-body");
    
    removeIcons(document.querySelectorAll(".order-by"));
    tableBody.textContent = "";

    loadTransactionsWithFilters(filters).then(transactions => {
        transactions.forEach(transaction => {
            const tableRow = createTableRow(transaction);

            tableBody.appendChild(tableRow);
        });
    });
}

function createTableRow(transaction) {
    const row = document.createElement("tr");

    for (let key in transaction) {
        if (key === "details") continue;
        if (key === "id") continue;
        const rowCell = document.createElement("td");
        rowCell.innerHTML = transaction[key];
        row.appendChild(rowCell);
        if (key === "reference") {
            rowCell.style.cursor = "pointer";
            addClickEventToCell(rowCell, transaction);
        }
    }

    let button = createDeleteButton();

    const rowCell = document.createElement("td");
    
    rowCell.appendChild(button);

    button.addEventListener("click", ()=> deleteTransaction(transaction));

    row.appendChild(rowCell);

    return row;

}

function createDeleteButton() {
    let deleteButton = document.createElement("button");
    let deleteIcon = document.createElement("span");

    deleteButton.setAttribute("class", "btn btn-sm");

    deleteIcon.classList.add("material-icons");

    deleteIcon.textContent = "delete";

    deleteButton.appendChild(deleteIcon);

    return deleteButton;
}

function addClickEventToCell(cell, transaction) {
    cell.addEventListener("click", () => {
        openTransactionDetails(transaction);
    });
}

function openTransactionDetails(transaction) {
    const openDetailsButton = document.getElementById("openTransactionDetails");
    const title = document.getElementById("transaction-reference");
    const details = document.getElementById("transaction-details");
    const addedOn = document.getElementById("transaction-addded");

    if (transaction.details === "") {
        details.textContent = "No details for this transaction";
    } else {
        details.textContent = transaction.details;
    }

    title.textContent = transaction.reference;
    addedOn.textContent = transaction.timestamp;

    openDetailsButton.click();
}

function deleteTransaction(transaction) {
    const perPage = document.getElementById('items-per-page').value;
    deleteTransactionWithId(transaction.id)
    .then(result => {
        let filters = {
            page: 1,
            date: "Date added",
            perPage: perPage,
            month: "All",
            category: "All"
        }

        generateHTML(filters);
        
        let deletionMessage = document.getElementById("deleted-transaction");

        deletionMessage.classList.remove("d-none");
        deletionMessage.textContent = result;

        setTimeout(() => {
            deletionMessage.classList.add("d-none");
        }, 1500);
    })
}

function generatePaginationLinks(filters) {
    const paginationItemsContainer = document.getElementById('pagination-links');
    const itemsPerPage = document.querySelector("#items-per-page").value;

    paginationItemsContainer.textContent = "";

    getTransactionsCount().then(count => {
        const pages = Math.ceil(count/itemsPerPage)
        for(let page = 1; page <= pages; page++) {
            const link = createLink(page);
            paginationItemsContainer.appendChild(link);
            link.addEventListener('click', e => {
                filters.page = e.target.dataset.page;
                generateHTML(filters);
            })
        }
    }) 
}

function createLink(page) {

    const link = document.createElement('a');
    link.classList = "btn btn-sm btn-outline-primary mr-2 pagination-link";
    link.setAttribute('data-page', page);
    link.textContent = page;

    return link;
}
