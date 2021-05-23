function setBoardDimensions() {
    const board = document.getElementsByClassName('main')[0];
    let width = board.clientWidth;
    let height = Math.floor(width * 0.667)
    let availHeight = document.body.scrollHeight;
    //if we don't have enough height, reduce width
    if (availHeight < height) {
        console.log("we don't have enough height(" + availHeight + " < " + height + "), reducing the width to " + Math.floor(availHeight * 1.333) + " instead of " + width);
        width = Math.floor(availHeight * 1.333);
        height = availHeight;
    }
    board.style.width = width;
    board.style.height = height;
}

function handleDragStart(e) {
    this.style.opacity = '0.4';
}

function handleDragEnd(e) {
    this.style.opacity = '1';
}

let items = document.querySelectorAll('.point .pip');
items.forEach(function (item) {
    item.addEventListener('dragstart', handleDragStart, false);
    item.addEventListener('dragend', handleDragEnd, false);
});

/**
 * Set either black or white draggable
 * @param {string} color 
 */
function setDraggable(color) {
    let otherColor = 'black';
    if (color == 'black') {
        otherColor = 'white';
    }
    let pieces = document.querySelectorAll('.pip.' + color );
    console.log('Found ' + pieces.length + ' ' + color + ' pieces');
    let otherPieces = document.querySelectorAll('.pip.' + otherColor);
    console.log('Found ' + otherPieces.length + ' ' + otherColor + ' pieces');
    pieces.forEach(function (item) {
        item.draggable = true;
    });
    otherPieces.forEach(function (item) {
        item.draggable = false;
    });
}

let currColor = 'none';
let oppositeColor = 'none';

function getCurrentColor(){
    let prevColor = currColor;
    currColor = ((document.getElementById('white').checked) ? 'white' : 'black');
    oppositeColor = ((document.getElementById('white').checked) ? 'black': 'white');
    if(currColor != prevColor){
        setDraggable(currColor);
    }
    return currColor;
}



