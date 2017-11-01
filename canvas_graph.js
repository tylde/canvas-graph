// console.log(dataG);

class Point {
    constructor() {

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
            backgroundColor: options.backgroundColor
        }

        this.isHovered = false;
        this.isInsideGraph = false;
        this.mainGraphWidth = options.width - 200;
        this.mainGraphHeigt = options.height - 120;

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

    getChartYRange(min, max) {
        let rangeMin = 0;
        let rangeMax = 0;
        let delta = max - min;
        if (min > 0 && max > 0) {            
            console.log(delta.toString().length);
        }
        else if (min === 0 && max > 0) {
            let delta = 0;
        }
        else if (min < 0 && max === 0) {

        }
        else if (min < 0 && max < 0) {

        }
        else console.log('Someting went wrong:', min, max);

        console.log('RANGE:', rangeMin, rangeMax);
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
        // console.log(xAxisData);
        // console.log(yAxisData);

        // ...
    }

    drawBackgroud() {
        let ctx = this.canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect((ctx.canvas.width - this.mainGraphWidth)/2 - 2, (ctx.canvas.height - this.mainGraphHeigt)/2 - 2, this.mainGraphWidth + 4, this.mainGraphHeigt + 4);
        ctx.fillStyle = this.chart.backgroundColor;
        ctx.fillRect((ctx.canvas.width - this.mainGraphWidth)/2, (ctx.canvas.height - this.mainGraphHeigt)/2, this.mainGraphWidth, this.mainGraphHeigt);
    }

    drawGrid() {

    }

    drawLine() {

    }

    drawPointer() {
        if (this.mouse.graphX > 0 && this.mouse.graphX < this.mainGraphWidth && this.mouse.graphY > 0 && this.mouse.graphY < this.mainGraphHeigt) {
            let ctx = this.canvas.getContext('2d');
            ctx.strokeWifth = 1;
            ctx.strokeStyle = 'white';
            ctx.beginPath();
            ctx.moveTo(Math.floor(0 + 200/2), Math.floor(this.mouse.graphY + 120/2));
            ctx.lineTo(Math.floor(this.mainGraphWidth + 200/2), Math.floor(this.mouse.graphY + 120/2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(Math.floor(this.mouse.graphX + 200/2), Math.floor(0 + 120/2));
            ctx.lineTo(Math.floor(this.mouse.graphX + 200/2), Math.floor(this.mainGraphHeigt + 120/2));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();


        }
    }

    draw() {
        let ctx = this.canvas.getContext('2d');
        this.getChartYRange(200, 300);
        this.drawBackgroud();
        this.prepareData();
        this.drawGrid();
        this.drawLine();
        this.drawPointer();


        // this.timer = requestAnimationFrame(this.draw.bind(this));
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

