document.addEventListener("DOMContentLoaded", () => {
    
    const orderButtons = document.querySelectorAll(".order-by");

    orderButtons.forEach(button => {
        button.addEventListener("click", event => {
            removeIcons(orderButtons);
            const columnToOrder = event.target.dataset.column;
            const orderIn = event.target.dataset.order;
            if (orderIn === "asc") {
                event.target.children[0].textContent = "˄";
                event.target.dataset.order = "desc";
            } else {                
                event.target.children[0].textContent = "˅";
                event.target.dataset.order = "asc";
            }

            sortTable(columnToOrder, orderIn);
        });
    });

});

function removeIcons (buttonsList) {
    buttonsList.forEach(button => {
        button.children[0].textContent = "";
    });
}

function compareValues(a, b, order) {
    if(order === "asc") {
        return (a < b) ? -1 : ((a > b) ? 1 : 0);
    } else {
        return (a > b) ? -1 : ((a < b) ? 1 : 0);
    }
}
  
function sortTable(columnNumber, order) {

    const tableBody = document.getElementById("table-body");
    
    let rowsToCompare = Array.from(table.querySelectorAll(`tr`));

    rowsToCompare = rowsToCompare.slice(1);
    
    let selector = `td:nth-child(${columnNumber}`;

    rowsToCompare.sort( (row1,row2) => {

        let data1 = row1.querySelector(selector);
        let data2 = row2.querySelector(selector);

        if (columnNumber === "2") { //Second column are float numbers
            return compareValues(
                parseFloat(data1.textContent.slice(1)), 
                parseFloat(data2.textContent.slice(1)), 
                order);
        }
        return compareValues(data1.textContent, data2.textContent, order);
    });

    rowsToCompare.forEach(row => tableBody.appendChild(row));
}