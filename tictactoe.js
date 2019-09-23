/*
  TicTacToeGame Class creates a tictactoe instance that has the functionality needed for playing and
  retaining a tic tac toe game against a computer opponent.
  The Class state is updated from two possible click events that take place in the browser,
  either from the click of a td cell that represents the game board, or from a reset button that appears
  after the game is over.
*/

class ticTacToeGame {
  constructor() {
    this.computerOpponentEnabled = true;
    this.players = ["X", "O"];
    this.playerIndex = 0; // used to switch between players

    // holds player info for each player
    this.playerInfo = {
      X: { moves: {}, priorityNextMove: null, name: "You" },
      O: { moves: {}, priorityNextMove: null, name: "Computer" }
    };

    // contains all cell IDs that are still available to be marked
    this.availableCells = {
      "0": true,
      "1": true,
      "2": true,
      "3": true,
      "4": true,
      "5": true,
      "6": true,
      "7": true,
      "8": true
    };

    // contains every possible win combination
    this.winCombinations = [
      ["0", "1", "2"],
      ["3", "4", "5"],
      ["6", "7", "8"],
      ["0", "3", "6"],
      ["1", "4", "7"],
      ["2", "5", "8"],
      ["0", "4", "8"],
      ["2", "4", "6"]
    ];
    this.winningCombo; // when a winning combination is found it will be stored here to be highlighted on the display using highlightWinningCells();
    this.turnsPlayed = 0; // if turnsplayed hits 9 and there is no winner, the program will execute showDraw();
    this.gameOver = false;
  }

  //Initializes two event listeners, one for marking an empty cell and one for resetting state to start a new game
  initialize() {
    $("body").on("click", ".cell", this.handleCellClick.bind(this));
    $("body").on("click", ".reset-button", this.handleResetClick.bind(this));
  }

  handleCellClick(el) {
    if (!el.currentTarget.innerText && !this.gameOver) {
      const currentPlayer = this.players[this.playerIndex];
      this.markBox(el, currentPlayer);
      const winnerFound = this.checkForWinner();

      if (winnerFound) {
        // if a winner is found, highlight the winning cells and display which player won the game
        this.highlightWinningCells();
        this.showWinner(currentPlayer);
        this.gameOver = true;
      } else if (this.turnsPlayed === 9) {
        // if there are no more available cells to click
        this.showDraw();
        this.gameOver = true;
      } else {
        // if the game isn't over, switch players
        this.playerIndex = !this.playerIndex ? 1 : 0;
      }
      if (this.gameOver) {
        $(".reset-button").css({ visibility: "visible" });
        return;
      }
      //computer opponent is enabled by default, computer will start it's turn here
      if (this.computerOpponentEnabled && this.playerIndex === 1) {
        this.computerMove();
      }
    }
  }

  // marks the clicked cell with an X or O, deletes that cell's id from this.availableCells and adds the cell id to that players playerInfo
  markBox(el, currentPlayer) {
    const $el = $(el.currentTarget);
    const cellId = $el.attr("id");
    $el.html(currentPlayer);
    delete this.availableCells[cellId];
    this.playerInfo[currentPlayer].moves[cellId] = true;
    this.turnsPlayed++;
  }

  // here the computer will evaluate if there is a winning move available for itself, if there isn't
  // it will see if there is a winning move for the User and attempt to block, and if neither exist
  // it will pick randomly from whats in this.availableCells
  computerMove() {
    let cellId;
    const userPriorityMove = this.playerInfo.X.priorityNextMove;
    const computerPriorityMove = this.playerInfo.O.priorityNextMove;
    const availableCells = this.availableCells;
    if (!!computerPriorityMove && availableCells[computerPriorityMove]) {
      cellId = computerPriorityMove;
      this.playerInfo.O.priorityNextMove = null;
    } else if (!!userPriorityMove && availableCells[userPriorityMove]) {
      cellId = userPriorityMove;
      this.playerInfo.X.priorityNextMove = null;
    } else {
      const cellArray = Object.keys(availableCells);
      const index = Math.floor(Math.random() * (cellArray.length - 1));
      cellId = cellArray[index];
    }
    setTimeout(() => $(`#${cellId}`).click(), 150);
  }

  // Iterates through each winning combination to see if there is a match between each combo set
  // and what is in that players info of past cell id's clicked. if 2 out 3 cells are matched and
  // the third is available, that cell id will be saved as that players priorityNextMove which
  // the computer will use to decide which cell to select next.
  checkForWinner() {
    const currentPlayer = this.players[this.playerIndex];
    const availableCells = this.availableCells;
    return this.winCombinations.reduce((gameWon, winCombo) => {
      if (gameWon) return true;
      let scoreCount = 0;
      let emptyCell;
      const isWinningCombo = winCombo.reduce((comboMatches, cell) => {
        if (!!this.playerInfo[currentPlayer].moves[cell]) {
          scoreCount++;
        } else if (availableCells[cell]) {
          emptyCell = cell;
          return false;
        } else {
          return false;
        }
        if (!comboMatches) return false;
        return true;
      }, true);
      if (isWinningCombo) {
        this.winningCombo = winCombo;
      }
      if (scoreCount === 2 && !!emptyCell) {
        this.playerInfo[currentPlayer].priorityNextMove = emptyCell;
      }
      return isWinningCombo;
    }, false);
  }

  showWinner(currentPlayer) {
    const name = this.playerInfo[currentPlayer].name;
    const message = name === "You" ? "Win!!!" : "Wins!";
    $(".results").html(`${name} ${message}`);
  }

  showDraw() {
    $(".results").html("It's a Draw!");
  }

  highlightWinningCells() {
    this.winningCombo.forEach(cell => {
      $(`#${cell}`).css({ "background-color": "#b5eb94" });
    });
  }
  // resets all of the class state necessary to start a fresh game and also resets the display game board
  handleResetClick() {
    $(".cell")
      .html("")
      .css({ "background-color": "white" });
    $(".results").html("Click any square to begin!");
    $(".reset-button").css({ visibility: "hidden" });
    this.playerInfo = {
      X: { moves: {}, priorityNextMove: null, name: "You" },
      O: { moves: {}, priorityNextMove: null, name: "Computer" }
    };
    this.playerIndex = 0;
    this.availableCells = {
      "0": true,
      "1": true,
      "2": true,
      "3": true,
      "4": true,
      "5": true,
      "6": true,
      "7": true,
      "8": true
    };
    this.winningCombo = null;
    this.turnsPlayed = 0;
    this.gameWon = false;
    this.gameOver = false;
  }
}

new ticTacToeGame().initialize();
