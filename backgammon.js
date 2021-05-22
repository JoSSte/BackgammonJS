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