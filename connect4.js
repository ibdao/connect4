"use strict";

/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  for (let i = 0; i < HEIGHT; i++) {
    let row = [];
    for (let j = 0; j < WIDTH; j++) {
      row.push(null);
    }
    board.push(row);
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  let htmlBoard = document.getElementById("board");

  // Creates the buttons to drop pieces on top of the HTML board
  let top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Creates the visible cells to drop the pieces. 
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // dynamically creates the main part of html board
  // uses HEIGHT to create table rows
  // uses WIDTH to create table cells for each row
  for (let y = 0; y < HEIGHT; y++) {
    let row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      let cell = document.createElement("td");
      
      // you'll use this later, so make sure you use y-x
      cell.id = `${y}-${x}`;
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return bottom empty y (null if filled) */

function findSpotForCol(x) {
  // x is column
  // y is row
  let y = HEIGHT - 1;
  for (let i = y; i >= 0; i--) {
    if (document.getElementById(`${i}-${x}`).innerHTML === "") {
      return i;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  let coord = document.createElement('div');
  document.getElementById(`${y}-${x}`).append(coord);
  return coord;
}

/** endGame: announce game end */

function endGame(msg) {
  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  let pieceToUpdate = placeInTable(y, x);
  pieceToUpdate.classList.add("piece", `player-${currPlayer}`);
  pieceToUpdate.id = `player-${currPlayer}`;


  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  let currhtmlBoard = document.getElementsByTagName('tr');
  currhtmlBoard = Array.from(currhtmlBoard).slice(1);
  let htmlToArr = currhtmlBoard.map(tr => Array.from(tr.getElementsByTagName('td')));
  let tie = htmlToArr.every(row => row.every(cell => cell.innerHTML !== ''));
  if (tie) endGame();

  // switch players
  if (currPlayer % 2 === 0) {
    currPlayer = 1;
  } else {
    currPlayer = 2;
  }
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {

  /** _win:
   * takes input array of 4 cell coordinates [ [y, x], [y, x], [y, x], [y, x] ]
   * returns true if all are legal coordinates for a cell & all cells match
   * currPlayer
   */
  function _win(cells) {

    // TODO: Check four cells to see if they're all legal & all color of current
    // player
    cells.every(cell => cell[0] > HEIGHT && cell[0] >= 0);
    cells.every(cell => cell[1] > WIDTH && cell[1] >= 0);
    // Not working yet
    // let id = cells[0].join('-');
    // let winningPlayer = document.getElementById(id).getElementsByClassName('piece').id;
    // cells.every(cell => cell[1] > WIDTH && cell[1] >= 0);
  }

  // using HEIGHT and WIDTH, generate "check list" of coordinates
  // for 4 cells (starting here) for each of the different
  // ways to win: horizontal, vertical, diagonalDR, diagonalDL
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // TODO: assign values to the below variables for each of the ways to win
      // horizontal has been assigned for you
      // each should be an array of 4 cell coordinates:
      // [ [y, x], [y, x], [y, x], [y, x] ]

      let horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      let vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      let diagDL = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      let diagDR = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];
      // find winner (only checking each win-possibility as needed)
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();
