document.addEventListener("DOMContentLoaded", () => {    
    const chartFilterSelect = document.getElementById("chartFilter");

    chartFilterSelect.addEventListener("change", event => {
        let chart = event.target.value;

        if (chart === "Select chart") clearChart();
        if (chart === "Category") createCategoryChart();
        if (chart === "Monthly") createMonthlyChart();
        if (chart === "Top 5") createTopChart();
    });
});

/* Creating charts functions depending on selection */

function clearChart() {
    const statisticsContainer = document.getElementById("statistics-container");
    statisticsContainer.textContent = "";
    statisticsContainer.appendChild(createCanvasElement());
}

function createCategoryChart() {
    let expenditures = Object.assign({}, expendituresTemplate);

    loadTransactionsForChart().then(transactions => {
        transactions.forEach(transaction => {
            let category = transaction.category;
            expenditures[category] += parseFloat(transaction.amount.slice(1));
            expenditures[category] = parseFloat(
                String(expenditures[category]).slice(0,5)
                );
        });

        let chartData = serializeData(
            Object.keys(categoryColors), 
            Object.values(expenditures), 
            Object.values(categoryColors), 
            "pie");

        generateChartWithData(chartData);
    });
}

function createMonthlyChart() {
    let monthlyExpenditures = Object.assign({}, monthsTemplate);

    loadTransactionsForChart().then(transactions => {
        transactions.forEach(transaction => {
            let month = transaction.receipt_date.substring(0,3);
            monthlyExpenditures[month] += parseFloat(transaction.amount.slice(1));
            monthlyExpenditures[month] = parseFloat(
                String(monthlyExpenditures[month]).slice(0,5)
                );
        });

        let chartData = serializeData(
            moment.monthsShort(), 
            Object.values(monthlyExpenditures), 
            monthsColors, 
            "bar");

        generateChartWithData(chartData);
    });
}

function createTopChart() {
    let topFive = {}
    let colorsForChart = []
       
    loadTransactionsForChart("top").then(transactions => {
        transactions.forEach(transaction => {
            topFive[transaction.reference] = transaction.amount.slice(1);
            colorsForChart.push(categoryColors[transaction.category]);
        });

        let chartData = serializeData(
            Object.keys(topFive), 
            Object.values(topFive), 
            colorsForChart, 
            "bar");

        generateChartWithData(chartData);
    });
}


/* Helper functions */
function serializeData(labels, expenditures, colors, chartType) {
    return {
        "labels" : labels,
        "expenditures" : expenditures,
        "colors" : colors,
        "type" : chartType
    }
}


function createCanvasElement() {
    let canvas = document.createElement("canvas");
    canvas.id = "canvas";

    canvas.setAttribute("style", "width: 100%; height: 50vh; max-width: 900px");
    canvas.setAttribute("class", "mxpython mx-auto");

    return canvas;
}


/* Create charts functions */
function generateChartWithData(data) {
    clearChart();

    let ctx = document.getElementById('canvas').getContext('2d');

    createChartOfType(ctx, data);    
}

function checkChartType(data) {
    if (data["type"] === "pie") return true;
    return false;
}

function createChartOfType(ctx, data) {
    let showThis = checkChartType(data);
    
    new Chart(ctx, {
        type: data["type"],
        data: {
            labels: data["labels"],
            datasets: [{
                data: data["expenditures"],
                backgroundColor: data["colors"],
                borderColor: "grey",
                borderWidth: 1,
            }]
        },
        options: {
            legend: {
                display: showThis,
            },
            scales: {
                yAxes: [{
                    ticks: {
                        display: !showThis,
                        beginAtZero: true,
                        userCallback: function(value) {
                            // Split every 3 charaacters from the end of the string
                            value = value.toString();
                            value = value.split(/(?=(?:...)*$)/);
                
                            // Convert the array to a string and format the output
                            value = value.join('.');
                            return '$' + value;
                        }
                    }
                }]
            },
        }
    });
}
