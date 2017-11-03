// console.log(dataG);

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}


class LineChart {
    constructor(canvas, rawData, options) {
        // canvas: Canvas, rawData: [...{ xAxis, yAxis1, yAxis2... }], options: {  }
        this.canvas = canvas;
        this.rawData = rawData;
        this.data = undefined;

        this.chart = {
            width: options.width,
            height: options.height,
            grid: options.grid,
            backgroundColor: options.backgroundColor,

            xAxis: {
                range: 0,
                start: 0,
                end: 0
            },
            yAxis: [
                
            ],

            colors: options.colors,

            points: []
        }

        this.isHovered = false;
        this.isInsideGraph = false;
        this.mainGraphWidth = options.width - 200;
        this.mainGraphHeight = options.height - 120;

        this.timer = undefined;

        this.mouse = {
            x: 0, y: 0,
            graphX: 0, graphY: 0
        }
    }

    updateCanvasSize() {
        let ctx = this.canvas.getContext('2d');
        ctx.canvas.width = this.chart.width;
        ctx.canvas.height = this.chart.height;
    }

    isInside(x, y) {

    }







    init() {
        this.updateCanvasSize();


        let handleMouseEnter = (event) => {
            this.isHovered = true;
            // console.log('hovered');
        }
        this.canvas.addEventListener('mouseenter', handleMouseEnter);

        let handleMouseLeave = (event) => {
            this.isHovered = false;
            // console.log('not hovered');
        }
        this.canvas.addEventListener('mouseleave', handleMouseLeave);

        let handleMouseMove = (event) => {
            // console.log(event.offsetX, event.offsetY);
            this.mouse.x = event.offsetX;
            this.mouse.y = event.offsetY;
            this.mouse.graphX = this.mouse.x - 200/2;
            this.mouse.graphY = this.mouse.y - 120/2;         
        }
        this.canvas.addEventListener('mousemove', handleMouseMove);
    }

    prepareData() {
        let xAxisData = [];
        let yAxisData = [];
        for (let i = 0; i < this.rawData.length; i++) {
            
            let tempDateTime = this.rawData[i][0];
            tempDateTime = tempDateTime.split(' ');
            let tempDate = tempDateTime[0].split('-');
            let tempTime = tempDateTime[1].split(':');
            xAxisData.push(new Date(tempDate[0], tempDate[1], tempDate[2], tempTime[0], tempTime[1], tempTime[2]));

            let tempData = [];
            for (let j = 0; j < this.rawData[i].length - 1; j++) {
                tempData.push(this.rawData[i][j+1]);
            }
            yAxisData.push(tempData);
        }
        this.data = {
            xAxisData,
            yAxisData
        }
    }

    calculateRange(min, max) {

        return [min, max];
    }

    getChartYRange() {
        // console.log(this.data.yAxisData)
        // console.log(this.data)
        this.chart.yAxis = [];

        for (let i = 0; i < this.data.yAxisData[0].length; i++) {
            let yArray = [];
            for (let j = 0; j < this.data.yAxisData.length; j++) {
                yArray.push(this.data.yAxisData[j][i]);
            }

            let min = Math.min.apply(null, yArray);
            let max = Math.max.apply(null, yArray);

            let [start, end] = this.calculateRange(min, max);

            // this.chart.yAxis.push({
            //     start: Math.min.apply(null, yArray),
            //     end: Math.max.apply(null, yArray),
            //     range: Math.max.apply(null, yArray) - Math.min.apply(null, yArray)
            // })
            this.chart.yAxis.push({
                start,
                end,
                range: end - start
            })
        }

        // console.log(this.chart.yAxis);
    }

    getChartXRange() {
        let [start, end] = [this.data.xAxisData[0].getTime(), this.data.xAxisData[this.data.xAxisData.length - 1].getTime()];
        if (start > end) {
            let temp = end;
            end = start;
            start = temp;
        }
        let dt = end - start;

        this.chart.xAxis.range = dt;
        this.chart.xAxis.start = start;
        this.chart.xAxis.end = end;
    }

    getPoints() {
        
        this.chart.points = [];
        for (let i = 0; i < this.chart.yAxis.length; i++) {
            let pointsArr = [];
            for (let j = 0; j < this.data.xAxisData.length; j++) {
                let xValue = this.data.xAxisData[j].getTime();
                let yValue = this.data.yAxisData[j][i];

                let x = 0, y = 0;

                x = (xValue - this.chart.xAxis.start) / this.chart.xAxis.range * this.mainGraphWidth;
                y = this.mainGraphHeight - (yValue - this.chart.yAxis[i].start) / this.chart.yAxis[i].range * this.mainGraphHeight;

                pointsArr.push(new Point(x + 200/2, y + 120/2))
            }


            this.chart.points.push(pointsArr);
        }
    }





    drawBackgroud() {
        let ctx = this.canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect((ctx.canvas.width - this.mainGraphWidth)/2 - 2, (ctx.canvas.height - this.mainGraphHeight)/2 - 2, this.mainGraphWidth + 4, this.mainGraphHeight + 4);
        ctx.fillStyle = this.chart.backgroundColor;
        ctx.fillRect((ctx.canvas.width - this.mainGraphWidth)/2, (ctx.canvas.height - this.mainGraphHeight)/2, this.mainGraphWidth, this.mainGraphHeight);
    }

    drawGrid() {
        let ctx = this.canvas.getContext('2d');

        // Y
        for (let i = 0; i <= 5; i++) {
            let ctx = this.canvas.getContext('2d');
            ctx.lineWidth = 2;
            ctx.lineJoin = 'round'
            ctx.strokeStyle = 'gray';
            ctx.beginPath();
            ctx.moveTo(Math.floor(-10 + 200/2), Math.floor(this.mainGraphHeight / 5 * i + 120/2));
            ctx.lineTo(Math.floor(10 + this.mainGraphWidth + 200/2), Math.floor(this.mainGraphHeight / 5 * i + 120/2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // X

    }

    drawGridText() {
        let ctx = this.canvas.getContext('2d');
        console.log(this.chart.yAxis);
        // Y1
        for (let i = 0; i <= 5; i++) {
            
            let tekst = Math.round((this.chart.yAxis[0].start + (5 - i) * this.chart.yAxis[0].range / 5) * 100) / 100;
            ctx.textBaseline = 'middle';
            ctx.font = '16px Calibri';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'right';
            ctx.fillText(tekst, -20 + 200/2, this.mainGraphHeight / 5 * i + 120/2);
        }

        // Y2
        for (let i = 0; i <= 5; i++) {
            let tekst = this.chart.yAxis[1].start + (5 - i) * this.chart.yAxis[1].range / 5;
            ctx.textBaseline = 'middle';
            ctx.font = '16px Calibri';
            ctx.fillStyle = 'white';
            ctx.textAlign = 'left';
            ctx.fillText(tekst, 20 + this.mainGraphWidth + 200/2, this.mainGraphHeight / 5 * i + 120/2);
        }

        console.log((new Date(2017, 10, 10, 0, 0, 0)).getTime());
        console.log((new Date(2017, 11, 10, 0, 0, 0)).getTime());

        // X

    }

    drawLine() {
        let ctx = this.canvas.getContext('2d');
        // console.log(this.chart.points);
        for (let i = 0; i < this.chart.points.length; i++) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = this.chart.colors[i];
            ctx.lineJoin = 'round'
            ctx.beginPath();
            ctx.moveTo(this.chart.points[i][0].x, this.chart.points[i][0].y);
            for (let j = 0; j < this.chart.points[i].length; j++) {
                ctx.lineTo(this.chart.points[i][j].x, this.chart.points[i][j].y);
            }
            ctx.stroke();
        }
    }

    drawPointer() {
        if (this.isHovered) {
            if (this.mouse.graphX > 0 && this.mouse.graphX < this.mainGraphWidth && this.mouse.graphY > 0 && this.mouse.graphY < this.mainGraphHeight) {
                let ctx = this.canvas.getContext('2d');
                ctx.lineWidth = 1;
                ctx.lineJoin = 'round'
                ctx.strokeStyle = 'gray';
                ctx.beginPath();
                ctx.moveTo(Math.floor(0 + 200/2), Math.floor(this.mouse.graphY + 120/2));
                ctx.lineTo(Math.floor(this.mainGraphWidth + 200/2), Math.floor(this.mouse.graphY + 120/2));
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(Math.floor(this.mouse.graphX + 200/2), Math.floor(0 + 120/2));
                ctx.lineTo(Math.floor(this.mouse.graphX + 200/2), Math.floor(this.mainGraphHeight + 120/2));
                ctx.stroke();
            }
        }
    }

    draw() {
        let ctx = this.canvas.getContext('2d');
        this.drawBackgroud();

        this.prepareData();
        this.getChartXRange();
        this.getChartYRange();

        this.getPoints();

        this.drawGrid();
        this.drawGridText();

        this.drawLine();
        this.drawPointer();


        // this.timer = setTimeout(this.draw.bind(this), 100);
    }



    plot() {
        if (!(this.canvas instanceof HTMLCanvasElement)) {
            console.error('Canvas doesn\'t exists!')
            return false;
        }
        this.init();
        this.draw();
    }


}

