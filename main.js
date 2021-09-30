var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PlayerType;
(function (PlayerType) {
    PlayerType["Manual"] = "Manual";
    PlayerType["Computer"] = "Computer";
})(PlayerType || (PlayerType = {}));
var Player = /** @class */ (function () {
    function Player() {
    }
    return Player;
}());
var ManualPlayer = /** @class */ (function (_super) {
    __extends(ManualPlayer, _super);
    function ManualPlayer(name, type) {
        var _this = _super.call(this) || this;
        _this.name = name;
        _this.type = type;
        return _this;
    }
    return ManualPlayer;
}(Player));
var AutomaticPlayer = /** @class */ (function (_super) {
    __extends(AutomaticPlayer, _super);
    function AutomaticPlayer(type) {
        var _this = _super.call(this) || this;
        _this.name = PlayerType.Computer;
        _this.type = type;
        return _this;
    }
    //this function check the empty cells and send them by array to random() function in AutomaticPlayer class
    AutomaticPlayer.prototype.getEmptyCells = function (cells) {
        var emptyCellsArray = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (cells[i][j].isEmpty) {
                    emptyCellsArray.push(cells[i][j]);
                }
            }
        }
        return emptyCellsArray;
    };
    AutomaticPlayer.prototype.random = function (cells) {
        var emptyCells = this.getEmptyCells(cells);
        var cell = emptyCells[Math.floor(Math.random() * (emptyCells.length - 1))];
        setTimeout(function () {
            cell.element.click();
        }, 1000);
    };
    AutomaticPlayer.prototype.strategic = function () {
    };
    return AutomaticPlayer;
}(Player));
var Cell = /** @class */ (function () {
    function Cell(elementBox) {
        //every 'box' is an element inside cell object
        this.element = elementBox;
        if (this.element.innerHTML === "") {
            this.isEmpty = true;
        }
        else {
            this.isEmpty = false;
        }
    }
    Cell.prototype.reset = function () {
        this.element.innerHTML = "";
        this.isEmpty = true;
    };
    //we got the type of the player that played and clicked on the cell.elemnt(boxElement) 
    //and if it's empty the innerHtml of the element (boxElement) will show the type that we've got.
    Cell.prototype.click = function (type) {
        if (this.isEmpty) {
            this.element.innerHTML = type;
            this.isEmpty = false;
        }
    };
    //this function is getting another cell and check if it's equal to the current cell
    Cell.prototype.isEqual = function (anotherCell) {
        //if the current cell is equal to anotherCell and if the current cell is not empty...
        if (this.element.innerHTML === anotherCell.element.innerHTML && !this.isEmpty) {
            return true;
        }
        //else...
        return false;
    };
    return Cell;
}());
var Board = /** @class */ (function () {
    function Board(player1Type, player2Type) {
        //X and O types
        this.X = '<i class="fa fa-times"></i>';
        this.O = '<i class="fa fa-circle"></i>';
        //cells[] is a logic board
        this.cells = [];
        this.isGameOver = false;
        this.winningDeclar = document.querySelector('#text');
        this.playersInit(player1Type, player2Type);
    }
    Board.prototype.reset = function (player1Type, player2Type) {
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                this.cells[i][j].reset();
            }
        }
        this.playersInit(player1Type, player2Type);
        this.winningDeclar.innerHTML = "";
        this.isGameOver = false;
    };
    Board.prototype.playersInit = function (player1Type, player2Type) {
        //the names of the players in input
        var player1Name = document.querySelector("#player1").value;
        var player2Name = document.querySelector("#player2").value;
        //create player instances by playerType (manual || computer)
        this.player1 = player1Type === PlayerType.Computer ? new AutomaticPlayer(this.X) : new ManualPlayer(player1Name, this.X);
        this.player2 = player2Type === PlayerType.Computer ? new AutomaticPlayer(this.O) : new ManualPlayer(player2Name, this.O);
        this.currentPlayer = this.player1;
    };
    Board.prototype.initialization = function () {
        var _this = this;
        //we get all the boxes element (html board) into boxes nodeList
        var boxes = document.querySelectorAll('.box');
        //we create logic board
        this.createMatrix();
        var _loop_1 = function (elementBox) {
            //the position of every box to create our logic board which is a matrix array
            var posId = elementBox.getAttribute('id');
            var position = posId.split('_');
            var row = parseInt(position[0]);
            var col = parseInt(position[1]);
            //we create new cell and put the elementBox inside cell object
            var cell = new Cell(elementBox);
            this_1.cells[row][col] = cell;
            //event to click on the cell.element which is the elementBox
            cell.element.addEventListener('click', function () {
                //isGameOver turn to true if we match one of the conditions below. so if someone wins -> isGameOver turn to true and the click won't work
                if (_this.isGameOver) {
                    return;
                }
                if (_this.currentPlayer === _this.player1) {
                    cell.click(_this.player1.type); //here we calling cell.click() and send the type X
                    _this.currentPlayer = _this.player2;
                    _this.handelComputerMoves();
                }
                else if (_this.currentPlayer === _this.player2) {
                    cell.click(_this.player2.type); //here we calling cell.click() and send the type O
                    _this.currentPlayer = _this.player1;
                    _this.handelComputerMoves();
                }
                _this.checkIfGameIsOver();
            });
        };
        var this_1 = this;
        //run into boxes nodeList
        for (var _i = 0, boxes_1 = boxes; _i < boxes_1.length; _i++) {
            var elementBox = boxes_1[_i];
            _loop_1(elementBox);
        }
        this.handelComputerMoves();
    };
    Board.prototype.handelComputerMoves = function () {
        if (this.currentPlayer instanceof AutomaticPlayer) {
            this.currentPlayer.random(this.cells);
        }
    };
    Board.prototype.createMatrix = function () {
        for (var i = 0; i < 3; i++) {
            this.cells[i] = [];
            for (var j = 0; j < 3; j++) {
                this.cells[i][j] = null;
            }
        }
    };
    Board.prototype.checkIfGameIsOver = function () {
        //check the rows
        //upper row
        if (this.checkRow(0)) {
            this.winner(this.cells[0][0]);
            this.isGameOver = true;
        }
        else if (this.checkRow(1)) {
            this.winner(this.cells[1][0]);
            this.isGameOver = true;
        }
        else if (this.checkRow(2)) {
            this.winner(this.cells[2][0]);
            this.isGameOver = true;
        }
        else if (this.checkColumn(0)) {
            this.winner(this.cells[0][0]);
            this.isGameOver = true;
        }
        else if (this.checkColumn(1)) {
            this.winner(this.cells[0][1]);
            this.isGameOver = true;
        }
        else if (this.checkColumn(2)) {
            this.winner(this.cells[0][2]);
            this.isGameOver = true;
        }
        else if (this.cells[0][0].isEqual(this.cells[1][1]) && this.cells[1][1].isEqual(this.cells[2][2])) {
            this.winner(this.cells[0][0]);
            this.isGameOver = true;
        }
        else if (this.cells[0][2].isEqual(this.cells[1][1]) && this.cells[1][1].isEqual(this.cells[2][0])) {
            this.winner(this.cells[0][2]);
            this.isGameOver = true;
        }
    };
    //check the row by index -> i=0 upper row, i=1 middle, i=2 bottom row
    Board.prototype.checkRow = function (i) {
        return this.cells[i][0].isEqual(this.cells[i][1]) && this.cells[i][1].isEqual(this.cells[i][2]);
    };
    //check the row by index -> j=0 left column, j=1 middle column, j=2 right column
    Board.prototype.checkColumn = function (j) {
        return this.cells[0][j].isEqual(this.cells[1][j]) && this.cells[1][j].isEqual(this.cells[2][j]);
    };
    //winner function get the cell with type of the winner, we get into players array
    //and check who from the players array have the type of the cell -> and then we know who's the winner
    Board.prototype.winner = function (cell) {
        if (cell.element.innerHTML === this.player1.type) {
            this.winningDeclar.innerHTML = this.player1.name + " is the winner!!!";
        }
        else if (cell.element.innerHTML === this.player2.type) {
            this.winningDeclar.innerHTML = this.player2.name + " is the winner!!!";
        }
    };
    return Board;
}());
var Game = /** @class */ (function () {
    function Game() {
        //run the game
        this.isGameStarted = false;
    }
    Game.prototype.start = function () {
        var _this = this;
        this.disableNameInput();
        var playButton = document.querySelector('.play-button');
        playButton.addEventListener('click', function () {
            var player1TypeValue = document.querySelector('input[name="competitor"]:checked').value;
            var player2TypeValue = document.querySelector('input[name="competitor2"]:checked').value;
            var player1Type = player1TypeValue === PlayerType.Computer ? PlayerType.Computer : PlayerType.Manual;
            var player2Type = player2TypeValue === PlayerType.Computer ? PlayerType.Computer : PlayerType.Manual;
            //after we played once, we reset the board
            if (_this.isGameStarted) {
                var returnValue = confirm('Are you sure you want to restart the game?');
                if (returnValue) {
                    _this.board.reset(player1Type, player2Type);
                }
            }
            else {
                _this.isGameStarted = true;
                _this.board = new Board(player1Type, player2Type);
                _this.board.initialization();
            }
        });
    };
    Game.prototype.disableNameInput = function () {
        var leftRadio = document.querySelectorAll('.competitor');
        var rightRadio = document.querySelectorAll('.competitor2');
        var iputNamePlayer1 = document.querySelector('#player1');
        var iputNamePlayer2 = document.querySelector('#player2');
        for (var _i = 0, leftRadio_1 = leftRadio; _i < leftRadio_1.length; _i++) {
            var radio = leftRadio_1[_i];
            radio.addEventListener('click', function () {
                if (document.querySelector('input[name="competitor"]:checked').value === PlayerType.Computer) {
                    iputNamePlayer1.setAttribute("disabled", "");
                }
                else {
                    iputNamePlayer1.removeAttribute("disabled");
                }
            });
        }
        for (var _a = 0, rightRadio_1 = rightRadio; _a < rightRadio_1.length; _a++) {
            var radio = rightRadio_1[_a];
            radio.addEventListener('click', function () {
                if (document.querySelector('input[name="competitor2"]:checked').value === PlayerType.Computer) {
                    iputNamePlayer2.setAttribute("disabled", "");
                }
                else {
                    iputNamePlayer2.removeAttribute("disabled");
                }
            });
        }
    };
    return Game;
}());
//start the game
var game = new Game();
game.start();
