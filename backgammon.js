//board dimensions
let dim = getDimensions();
const w = dim[1];
const h = dim[0];
let pieces = {

    'black': [
        0, 0, 0, 0, 3, 0,  //top left
        5, 0, 0, 0, 0, 0,  //top right
        5, 0, 0, 0, 0, 0,  //bot left
        0, 0, 0, 0, 0, 2,  //bot right
        0                  //bar
    ],
    'white': [
        5, 0, 0, 0, 0, 0, //top left
        0, 0, 0, 0, 0, 2, //top right
        0, 0, 0, 0, 3, 0, //bot left
        5, 0, 0, 0, 0, 0, //bot right
        0                 //bar
    ]
};
let barCount = 0;
let barWidth = 50;
//point dimentions will be overwritten by drawBoard();
let pointWidth = 10;
let pointHeight = 30;
let pieceRadius = 8;

function getDimensions(){
    const board = document.getElementById('bgBoard');
    let width = board.clientWidth;
    let height = Math.floor(width * 0.667)
    let availHeight = document.body.scrollHeight;
    //if we don't have enough height, reduce width
    if (availHeight < height){
        width = availHeight * 1.333;
        height = availHeight;
    }
    return [height, width];
}


function drawBoard() {
    /****** Set up board dimensions and canvas scale *******/

    const boardCanvas = document.getElementById('bgBoard');
    const pieceCanvas = document.getElementById('bgPieceLayer');
    boardCanvas.style.width = w + "px";
    boardCanvas.style.height = h + "px";
    pieceCanvas.style.width = w + "px";
    pieceCanvas.style.height = h + "px";

    // Set actual size in memory (scaled to account for extra pixel density).
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    boardCanvas.width = Math.floor(w * scale);
    boardCanvas.height = Math.floor(h * scale);
    pieceCanvas.width = Math.floor(w * scale);
    pieceCanvas.height = Math.floor(h * scale);

    /****** Draw board *******/

    if (boardCanvas.getContext) {
        //calculate cells dimensions
        pointWidth = (w - barWidth) / 12;
        pointHeight = (h - barWidth) / 2;
        //calculate piece radius
        pieceRadius = Math.floor(pointWidth / 2);
        var ctx = boardCanvas.getContext('2d');

        var pointIdx = 0;
        var evenFill = 'grey';
        var oddFill = 'maroon';
        //draw top points
        for (let x = 0; x < 12; x++) {
            let offset = Math.floor(pointWidth * x);
            //if 7-12, add bar width
            if (x > 5) {
                offset += barWidth;
            }
            var pointPath = new Path2D();
            pointPath.moveTo(offset, 0);
            pointPath.lineTo(pointWidth + offset, 0);
            pointPath.lineTo(pointWidth + offset - Math.floor(pointWidth / 2), pointHeight);
            ctx.fillStyle = ((x % 2 == 0) ? evenFill : oddFill)
            ctx.fill(pointPath);
        }

        //draw bottom points
        for (let x = 0; x < 12; x++) {
            let offset = Math.floor(pointWidth * x);
            //if 7-12, add bar width
            if (x > 5) {
                offset += barWidth;
            }
            var pointPath = new Path2D();
            pointPath.moveTo(offset, h);
            pointPath.lineTo(pointWidth + offset, h);
            pointPath.lineTo(pointWidth + offset - Math.floor(pointWidth / 2), pointHeight + barWidth);
            ctx.fillStyle = ((x % 2 == 0) ? oddFill : evenFill)
            ctx.fill(pointPath);
        }

        drawPieces(pieceCanvas.getContext('2d'));
    }
}

/**
 * Draws pieces to the board based on the 'pieces' object
 */
function drawPieces(ctx) {
    for (const col of ['black', 'white']) {
        for (let placeCtr = 0; placeCtr < 25; placeCtr++) {
            let place = 'top';
            if (placeCtr == 24) {
                place = 'bar';
            } else if (placeCtr > 11) {
                place = 'bot';
            }
            //console.log(col + ' ' + placeCtr + ' ' + pieces[col][placeCtr] + ' ' + place);
            if (pieces[col][placeCtr] > 0) {
                let offset = (placeCtr > 11) ? placeCtr - 12 : placeCtr;
                for (let pcCtr = 1; pcCtr <= pieces[col][placeCtr]; pcCtr++) {
                    if (place == 'bar') {
                        barCount++;
                    }
                    drawPiece(ctx, col, place, offset, pcCtr);
                }
            }
        }
    }
}

/**
 * ctx = 2d drawing context
 * color = 'black' or 'white'
 * place = 'top' 'bot' 'bar'
 * idx = index position (void in case place = 'bar') 
 * num = piece number at this position
 */
function drawPiece(ctx, color, place, idx, num) {
    let numDraw = num;
    let x = pieceRadius;
    let y = pieceRadius;
    if (num > 5) {
        numDraw = 5
    }
    x = Math.floor(pointWidth * idx) + pieceRadius;
    if (place == 'top') {
        y = Math.floor(pieceRadius * numDraw);
    } else if (place == 'bot') {
        y = h - Math.floor(pieceRadius * numDraw);
    } else {//bar
        //TODO: show more pieces
        x = Math.floor(w / 2);
        y = Math.floor((h / 2) + barCount * pieceRadius);
    }
    // take bar width into account
    if (idx > 5 && place != 'bar') {
        x += barWidth;
    }

    //TODO: show number for more than 5 pieces

    let stroke = 'black';
    if (color == 'black') {
        stroke = 'silver';
    }

    console.log(color + ' ' + place + ' ' + idx + ' ' + num)

    ctx.beginPath();
    ctx.arc(x, y, pieceRadius, Math.PI * 2, false);
    ctx.strokeStyle = stroke;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
}

drawBoard();