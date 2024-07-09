let soldList = [];

function loadData() {
    const today = new Date().toLocaleDateString();
    if (localStorage.getItem(today) == null) {
        localStorage.setItem(today, JSON.stringify({'soldList': soldList }));
    } else {
        const tmp = JSON.parse(localStorage.getItem(today));
        soldList = tmp.soldList;
    }
}
function timeCount() {
    const startTime = soldList[soldList.length - 1]['time'].substring(0, 5);
    const endTime = soldList[0]['time'].substring(0, 5);
    const timeRange = generateTimeRange(startTime, endTime);
	let totalSales = 0, totalQuantity = 0;
    let soldCountByTime = {};
    timeRange.forEach(time => {
        soldCountByTime[time] = 0;
    });
    soldList.forEach(item => {
        const time = item['time'].substring(0, 5);
		const amount = parseFloat(item['amount']);
		const price = parseFloat(item['price']);
        soldCountByTime[time] += amount;
		totalSales += amount;
		totalQuantity += amount / price;
    });
	document.querySelector("#totalSales").textContent = '总销售额：' + totalSales + ' 元';
	document.querySelector("#totalQuantity").textContent = '总销售量：' + parseInt(totalQuantity) + ' 斤';
    const timeCountctx = document.getElementById('timeCount');
    new Chart(timeCountctx, {
        type: 'bar',
        data: {
            labels: Object.keys(soldCountByTime),
            datasets: [{
                label: '金额',
                data: Object.values(soldCountByTime),
                borderWidth: 2
            }]
        },
    });
}
// 生成完整的时间范围
function generateTimeRange(start, end) {
    var startTime = new Date('2000-01-01 ' + start);
    var endTime = new Date('2000-01-01 ' + end);
    var timeRange = [];
    while (startTime <= endTime) {
      var time = startTime.toTimeString().substring(0, 5);
      timeRange.push(time);
      startTime.setMinutes(startTime.getMinutes() + 1);
    }
    return timeRange;
  }