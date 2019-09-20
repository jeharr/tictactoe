class ticTacToeGame {
  constructor() {
    this.computerOpponentEnabled = true;
    this.players = ["X", "O"];
    this.playerInfo = {
      X: { moves: {}, numWins: 0, priorityNextMove: null },
      O: { moves: {}, numWins: 0, priorityNextMove: null }
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
    this.winningCombo;
    this.turnsPlayed = 0;
    this.gameWon = false;
    this.gameOver = false;
  }

  initialize() {
    $("body").on("click", ".cell", this.handleClick.bind(this));
  }

  handleClick(el) {
    if (!el.currentTarget.innerText && !this.gameWon) {
      const currentPlayer = this.players[this.playerIndex];
      this.turnsPlayed++;
      this.markBox(el, currentPlayer);
      const cell = $(el.currentTarget).attr("id");
      this.playerInfo[currentPlayer].moves[cell] = true;
      this.gameWon = this.checkBoard();
      if (this.gameWon) {
        console.log("THe Game is won");
        this.highlightWinningCells();
      } else {
        console.log("next persons turn");
        this.playerIndex = !this.playerIndex ? 1 : 0;
      }
      if (this.turnsPlayed === 9 || this.gameWon) {
        this.gameOver = true;
        return;
      }
      if (this.computerOpponentEnabled && this.playerIndex === 1) {
        this.computerMove();
      }
    }
  }

  computerMove() {
    let cellId;
    const Xpriority = this.playerInfo.X.priorityNextMove;
    const Opriority = this.playerInfo.O.priorityNextMove;
    const availableCells = this.availableCells;
    if (!!Opriority && availableCells[Opriority]) {
      cellId = Opriority;
      this.playerInfo.O.priorityNextMove = null;
    } else if (!!Xpriority && availableCells[Xpriority]) {
      cellId = Xpriority;
      this.playerInfo.X.priorityNextMove = null;
    } else {
      const cellArray = Object.keys(availableCells);
      const index = Math.floor(Math.random() * (cellArray.length - 1));
      cellId = cellArray[index];
    }
    console.log(cellId);
    setTimeout(() => $(`#${cellId}`).click(), 350);
  }

  highlightWinningCells() {
    this.winningCombo.forEach(cell => {
      $(`#${cell}`).css({ "background-color": "#b5eb94" });
    });
  }

  checkBoard() {
    const currentPlayer = this.players[this.playerIndex];
    const opponent = this.players[+!this.playerIndex];
    return this.winCombinations.reduce((gameWon, winCombo) => {
      if (gameWon) return true;
      let scoreCount = 0;
      let emptyCell;
      const isWinningCombo = winCombo.reduce((comboMatches, cell) => {
        if (!!this.playerInfo[currentPlayer].moves[cell]) {
          scoreCount++;
        } else if (this.playerInfo[opponent].moves[cell]) {
          return false;
        } else {
          emptyCell = cell;
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
  markBox(el, currentPlayer) {
    const $el = $(el.currentTarget);
    $el.html(currentPlayer);
    delete this.availableCells[$el.attr("id")];
  }
}

new ticTacToeGame().initialize();
