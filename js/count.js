let dayList = [];
function loadData() {
    if (localStorage.getItem("dayList") == null) {
        localStorage.setItem("dayList", JSON.stringify([]));
    } else {
        dayList = JSON.parse(localStorage.getItem("dayList"));
    }
}
function loadSalesList(day) {
    if (localStorage.getItem(day) == null) {
        localStorage.setItem(day, JSON.stringify({ "salesList": [] }));
        return [];
    } else {
        const tmp = JSON.parse(localStorage.getItem(day));
        return tmp.salesList
    }
}
function calcSalesAmount(day, paymentMethod = "总计") {
    let salesList = loadSalesList(day);
    let res = 0;
    salesList.forEach(item => {
        if (paymentMethod == "总计" || item["paymentMethod"] == paymentMethod) {
            res += parseFloat(item["amount"]);
        }
    });
    return res;
}
function calcSalesVolume(day) {
    let salesList = loadSalesList(day);
    let res = 0;
    salesList.forEach(item => {
        res += parseFloat(item["amount"]) / parseFloat(item["price"]);
    });
    return res;
}
function calcTimeSalesStatistic(day) {
    const salesList = loadSalesList(day);
    const startTime = salesList[salesList.length - 1]["time"].substring(0, 5);
    const endTime = salesList[0]["time"].substring(0, 5);
    const timeRange = generateTimeRange(startTime, endTime);
    let timeSalesList = {};
    timeRange.forEach(time => {
        timeSalesList[time] = 0;
    });
    salesList.forEach(item => {
        timeSalesList[item["time"].substring(0, 5)] += parseFloat(item["amount"]);
    });
    return timeSalesList;
}
function salesStatistic() {
    const today = new Date().toLocaleDateString();
    const salesList = loadSalesList(today);
    let totalSalesAmount = calcSalesAmount(today);
    let totalSalesVolume = calcSalesVolume(today);
    let totalWeChatSales = calcSalesAmount(today, "微信");
    let totalCashSales = calcSalesAmount(today, "现金");
    document.querySelector("#totalSales").textContent = "今日总收入：" + totalSalesAmount + " 元";
    document.querySelector("#totalWeChatSales").textContent = "今日微信收入：" + totalWeChatSales + " 元";
    document.querySelector("#totalCashSales").textContent = "今日现金收入：" + totalCashSales + " 元";
    document.querySelector("#totalQuantity").textContent = "今日总销售量：" + Math.round(totalSalesVolume) + " 斤";
}
function timeStatisticChart() {
    const today = new Date().toLocaleDateString();
    const timeSalesList = calcTimeSalesStatistic(today);
    const ctx = document.getElementById("timeStatisticChart");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: Object.keys(timeSalesList),
            datasets: [{
                label: "金额",
                data: Object.values(timeSalesList),
                borderWidth: 2
            }]
        },
    });
}
function dayStatisticChart() {
    let weChatSalesList = [];
    let cashSalesList = [];
    let totalSalesList = [];
    dayList.forEach(day => {
        totalSalesList.push(calcSalesAmount(day));
        cashSalesList.push(calcSalesAmount(day, "现金"));
        weChatSalesList.push(calcSalesAmount(day, "微信"));
    });
    const ctx = document.getElementById("dayStatisticChart");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: dayList,
            datasets: [
                {
                    label: "总计",
                    data: totalSalesList,
                    borderWidth: 2
                }, {
                    label: "微信",
                    data: weChatSalesList,
                    borderWidth: 2
                }, {
                    label: "现金",
                    data: cashSalesList,
                    borderWidth: 2
                }
            ]
        },
    });
}

// 生成完整的时间范围
function generateTimeRange(start, end) {
    var startTime = new Date("2000-01-01 " + start);
    var endTime = new Date("2000-01-01 " + end);
    var timeRange = [];
    for (; startTime <= endTime; startTime.setMinutes(startTime.getMinutes() + 1)) {
        var time = startTime.toTimeString().substring(0, 5);
        timeRange.push(time);
    }
    return timeRange;
}