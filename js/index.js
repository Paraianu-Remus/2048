import Grid from "./grid.js";
import Tile from "./tile.js";
import { popupAdd } from "./popup.js";

const gameBoard = document.getElementById("game-board");

const grid = new Grid(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
grid.randomEmptyCell().tile = new Tile(gameBoard);
setupInput();

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true });
}

// Key used to move the tiles
async function handleInput(e) {
  switch (e.key) {
    case "ArrowUp":
    case "w":
    case "W":
      if (!canMoveUp()) {
        setupInput();
        return;
      }
      await moveUp();
      break;
    case "ArrowLeft":
    case "a":
    case "A":
      if (!canMoveLeft()) {
        setupInput();
        return;
      }
      await moveLeft();
      break;
    case "ArrowDown":
    case "s":
    case "S":
      if (!canMoveDown()) {
        setupInput();
        return;
      }
      await moveDown();
      break;
    case "ArrowRight":
    case "d":
    case "D":
      if (!canMoveRight()) {
        setupInput();
        return;
      }
      await moveRight();
      break;
    default:
      setupInput();
      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  // Adds a new tile after merge
  const newTile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = newTile;
  //

  if (!canMoveUp() && !canMoveLeft() && !canMoveDown() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => {
      popupAdd();
    });
    return;
  }
  // document.getElementById("score").textContent = score;
  setupInput();
}
//

// Slide functions
function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }
      if (cell.tile == null) {
        return false;
      }
      const moveToCell = group[index - 1];
      return moveToCell.canAccept(cell.tile);
    });
  });
}
//

// Checks if cells can move in selected direction
function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];
      for (let i = 1; i < group.length; i++) {
        const cell = group[i];
        if (cell.tile == null) {
          continue;
        }
        let lastValidCell;
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];
          if (!moveToCell.canAccept(cell.tile)) {
            break;
          }
          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }
      return promises;
    })
  );
}
//
