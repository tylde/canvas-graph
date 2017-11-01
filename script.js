let canvas = document.getElementById('chart-canvas');

let options = {
    width: 1400,
    height: 400,
    backgroundColor: '#17415D',
    grid: {
        xAxis: {

        },
        yAxis: {

        }
    }
};

// let dataG = [
//     {"time":"2017-10-31 21:19:58","sellPrice":"5.55","sellAmount":"24231"},
//     {"time":"2017-10-31 21:09:57","sellPrice":"5.56","sellAmount":"24195"},
//     {"time":"2017-10-31 20:59:57","sellPrice":"5.57","sellAmount":"23997"},
//     {"time":"2017-10-31 20:49:56","sellPrice":"5.58","sellAmount":"23966"},
//     {"time":"2017-10-31 20:39:55","sellPrice":"5.55","sellAmount":"23956"},
//     {"time":"2017-10-31 20:29:55","sellPrice":"5.59","sellAmount":"23927"}
// ]


let data = [];
for (let i = 0; i < dataG.length; i++) {
    let arr = [dataG[i].time, dataG[i].sellPrice, dataG[i].sellAmount];
    data.push(arr);
}

let chart = new LineChart(canvas, data, options);
chart.plot();