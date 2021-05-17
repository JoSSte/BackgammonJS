//board dimensions
let dim = getDimensions();
const scale = window.devicePixelRatio;
const w = dim.w;
const h = dim.h;
const scaledWidth = Math.floor(w * scale);
const scaledHeight = Math.floor(h * scale);
const defaultPieces = {

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
let pieces = JSON.parse(JSON.stringify(defaultPieces));
let barCount = 0;
let barWidth = 50;
//point dimentions will be overwritten by drawBoard();
let pointWidth = 10;
let pointHeight = 30;
let pieceRadius = 8;

function getDimensions() {
    const board = document.getElementById('bgBoard');
    let width = board.clientWidth;
    let height = Math.floor(width * 0.667)
    let availHeight = document.body.scrollHeight;
    //if we don't have enough height, reduce width
    if (availHeight < height) {
        console.log("we don't have enough height(" + availHeight + " < " + height + "), reducing the width to " + Math.floor(availHeight * 1.333) + " instead of " + width);
        width = Math.floor(availHeight * 1.333);
        height = availHeight;
    }
    return { h: height, w: width };
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
    boardCanvas.width = scaledWidth;
    boardCanvas.height = scaledHeight;
    pieceCanvas.width = scaledWidth;
    pieceCanvas.height = scaledHeight;

    /****** Draw board *******/

    if (boardCanvas.getContext) {
        //calculate cells dimensions
        pointWidth = Math.floor((scaledWidth - barWidth) / 12);
        pointHeight = Math.floor((scaledHeight - barWidth) / 2);
        console.log('point width: ' + pointWidth);

        //calculate piece radius
        pieceRadius = Math.floor(pointWidth / 2.5);
        console.log('piece radius: ' + pieceRadius);
        var ctx = boardCanvas.getContext('2d');

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
            var pointPath2 = new Path2D();
            pointPath2.moveTo(offset, scaledHeight);
            pointPath2.lineTo(pointWidth + offset, scaledHeight);
            pointPath2.lineTo(pointWidth + offset - Math.floor(pointWidth / 2), pointHeight + barWidth);
            ctx.fillStyle = ((x % 2 == 0) ? oddFill : evenFill)
            ctx.fill(pointPath2);
        }

        drawPieces();
    }
}

/**
 * Draws pieces to the board based on the 'pieces' object
 */
function drawPieces() {
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
                    drawPiece(col, place, offset, pcCtr);
                }
            }
        }
    }
}

/**
 * color = 'black' or 'white'
 * place = 'top' 'bot' 'bar'
 * idx = index position (void in case place = 'bar') 
 * num = piece number at this position
 */
function drawPiece(color, place, idx, num) {
    const ctx = document.getElementById('bgPieceLayer').getContext('2d');
    let numDraw = num;
    let x = Math.floor(pointWidth * idx + pieceRadius + (pointWidth - (2.25 * pieceRadius)));
    let y = pieceRadius;
    if (num > 5) {
        numDraw = 5
    }
    if (place == 'top') {
        y = Math.floor(pieceRadius * 2 * numDraw) - pieceRadius;
    } else if (place == 'bot') {
        y = scaledHeight - Math.floor(pieceRadius * 2 * numDraw) + pieceRadius;
    } else {//bar
        //TODO: show more pieces
        x = Math.floor(scaledWidth / 2);
        y = Math.floor((scaledHeight / 2) + barCount * pieceRadius);
    }
    // take bar width into account
    if (idx > 5 && place != 'bar') {
        x += barWidth;
    }

    //TODO: show number on top pieces, for more than 5 pieces
    let stroke = '#222222';

    ctx.beginPath();
    ctx.arc(x, y, pieceRadius, Math.PI * 2, false);
    ctx.strokeStyle = stroke;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
}

function clearPieceLayer() {
    let canvas = document.getElementById('bgPieceLayer');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Reset Pieces and redraw
 */
function resetBoard() {
    console.log('Resetting board');
    pieces = JSON.parse(JSON.stringify(defaultPieces));
    clearPieceLayer();
    drawPieces();
}


// function to get the canvas coordinate of a mouse click
function getPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

// add event handler to see if we have clicked a game piece
document.getElementById('bgPieceLayer').addEventListener("click", function (e) {
    var pos = getPosition(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data;
    var col = p[0] + p[1] + p[2];
    var color = 'unknown';

    // did we click a game piece (color != transparent)
    if (col + p[3] == 0) {
        console.log("click did not hit agame piece");
        return false;
    } else if (col == 765) {
        color = 'white';
    } else if (col == 0) {
        color = 'black';
    }
    if (color == 'unknown') {
        console.log("unknown color - edge maybe?");
        return false;
    }
    let barW = 0;
    if (x > scaledWidth / 2) {
        barW = barWidth;
    }
    console.log(p[0] + ' ' + p[1] + ' ' + p[2] + " " + color + " " + coord);
    let estimatedOffset = Math.floor((x - barW) / pointWidth);
    if (y > scaledHeight / 2) {
        estimatedOffset += 12;
    }
    console.log('offset: ' + estimatedOffset);
    console.log(pieces[color][estimatedOffset] + ' ' + color + ' pieces')
});

function showMoves() {
    let movesLayer = document.getElementById('possibleMovesLayer');
    let currColor = ((document.getElementById('white').checked) ? 'white' : 'black');
    movesLayer.classList.toggle('hidden');
    console.log('current player = ' + currColor);
}


/* Start game */

drawBoard();