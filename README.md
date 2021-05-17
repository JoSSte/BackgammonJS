## Features
* Board
  * Drawn on its own layer
* Pieces
  * Drawn in standard configuration
  * On their own layer, which can be cleared, without having to redraw the board
  * Bar implemented, supporting pieces of both colors
* Interactions
  * Clicking the pieces layer identifies the stack of pieces clicked (except for the bar.) 
    * Clicks are interpreted on the pieces layer, so that has to be on top
    * Clicks on non-pieces, or on the border of pieces are ignored as "ambiguous"
  * 

## TODO
* Dice
  * Decide on randomization method
  * Roll button
  * Dice color
* Moves
  * Implement highlighting ofpossible moves
    * on click: highlight where you can move
    * on roll: highlight pieces that can be moved
* PIP count
  *  Create PIP counter
