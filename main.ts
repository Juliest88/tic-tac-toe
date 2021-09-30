enum PlayerType {
    Manual = 'Manual',
    Computer = 'Computer'
}

class Player {
    //we have 2 players that we'll create and they will be a Player type
    name: string;
    type: string;
}

class ManualPlayer extends Player {
    constructor(name: string, type: string) {
        super();
        this.name = name;
        this.type = type;
    }
}

class AutomaticPlayer extends Player {

    constructor(type: string) {
        super();
        this.name = PlayerType.Computer;
        this.type = type;
    }

    //this function check the empty cells and send them by array to random() function in AutomaticPlayer class
    getEmptyCells(cells: Cell[][]) {
        let emptyCellsArray: Cell[] = [];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (cells[i][j].isEmpty) {
                    emptyCellsArray.push(cells[i][j]);
                }
            }
        }
        return emptyCellsArray;
    }
    random(cells: Cell[][]) {
        let emptyCells = this.getEmptyCells(cells);
        let cell = emptyCells[Math.floor(Math.random() * (emptyCells.length - 1))];
        setTimeout(() => {
            (<HTMLElement>cell.element).click();
        }, 1000);
    }
    strategic() {

    }
}


class Cell {
    //about the cell, and what happend if it clicked
    element: Element;
    isEmpty: boolean;

    constructor(elementBox: Element) {
        //every 'box' is an element inside cell object
        this.element = elementBox;
        if (this.element.innerHTML === "") {
            this.isEmpty = true;
        }
        else {
            this.isEmpty = false;
        }
    }
    reset() {
        this.element.innerHTML = "";
        this.isEmpty = true;
    }
    //we got the type of the player that played and clicked on the cell.elemnt(boxElement) 
    //and if it's empty the innerHtml of the element (boxElement) will show the type that we've got.
    click(type: string) {
        if (this.isEmpty) {
            this.element.innerHTML = type;
            this.isEmpty = false;
        }
    }
    //this function is getting another cell and check if it's equal to the current cell
    isEqual(anotherCell: Cell) {
        //if the current cell is equal to anotherCell and if the current cell is not empty...
        if (this.element.innerHTML === anotherCell.element.innerHTML && !this.isEmpty) {
            return true;
        }
        //else...
        return false;
    }
}

class Board {
    //X and O types
    X: string = '<i class="fa fa-times"></i>';
    O: string = '<i class="fa fa-circle"></i>';
    player1: Player;
    player2: Player;
    currentPlayer: Player;
    //cells[] is a logic board
    cells: Cell[][] = [];
    isGameOver: boolean = false;
    winningDeclar = document.querySelector('#text');

    constructor(player1Type: PlayerType, player2Type: PlayerType) {
        this.playersInit(player1Type, player2Type);
    }

    reset(player1Type: PlayerType, player2Type: PlayerType) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                this.cells[i][j].reset();
            }
        }
        this.playersInit(player1Type, player2Type);
        this.winningDeclar.innerHTML = "";
        this.isGameOver = false;
    }
    playersInit(player1Type: PlayerType, player2Type: PlayerType) {
        //the names of the players in input
        let player1Name = (<HTMLInputElement>document.querySelector("#player1")).value;
        let player2Name = (<HTMLInputElement>document.querySelector("#player2")).value;
        //create player instances by playerType (manual || computer)
        this.player1 = player1Type === PlayerType.Computer ? new AutomaticPlayer(this.X) : new ManualPlayer(player1Name, this.X);
        this.player2 = player2Type === PlayerType.Computer ? new AutomaticPlayer(this.O) : new ManualPlayer(player2Name, this.O);

        this.currentPlayer = this.player1;
    }

    initialization() {
        //we get all the boxes element (html board) into boxes nodeList
        let boxes = document.querySelectorAll('.box');
        //we create logic board
        this.createMatrix();
        //run into boxes nodeList
        for (let elementBox of boxes) {
            //the position of every box to create our logic board which is a matrix array
            let posId = elementBox.getAttribute('id');
            let position = posId.split('_');
            let row = parseInt(position[0]);
            let col = parseInt(position[1]);
            //we create new cell and put the elementBox inside cell object
            let cell: Cell = new Cell(elementBox);
            this.cells[row][col] = cell;
            //event to click on the cell.element which is the elementBox
            cell.element.addEventListener('click', () => {
                //isGameOver turn to true if we match one of the conditions below. so if someone wins -> isGameOver turn to true and the click won't work
                if (this.isGameOver) {
                    return;
                }
                if (this.currentPlayer === this.player1) {
                    cell.click(this.player1.type); //here we calling cell.click() and send the type X
                    this.currentPlayer = this.player2;
                    this.handelComputerMoves();
                }
                else if (this.currentPlayer === this.player2) {
                    cell.click(this.player2.type); //here we calling cell.click() and send the type O
                    this.currentPlayer = this.player1;
                    this.handelComputerMoves();
                }
                this.checkIfGameIsOver();
            });
        }
        this.handelComputerMoves();
    }
    handelComputerMoves() {
        if (this.currentPlayer instanceof AutomaticPlayer) {
            this.currentPlayer.random(this.cells);
        }
    }

    createMatrix() {
        for (let i = 0; i < 3; i++) {
            this.cells[i] = [];
            for (let j = 0; j < 3; j++) {
                this.cells[i][j] = null;
            }
        }
    }

    checkIfGameIsOver() {
        //check the rows
        //upper row
        if (this.checkRow(0)) {
            this.winner(this.cells[0][0]);
            this.isGameOver = true;
        }
        //middle row
        else if (this.checkRow(1)) {
            this.winner(this.cells[1][0]);
            this.isGameOver = true;
        }
        //bottom row
        else if (this.checkRow(2)) {
            this.winner(this.cells[2][0]);
            this.isGameOver = true;
        }
        //left column
        else if (this.checkColumn(0)) {
            this.winner(this.cells[0][0]);
            this.isGameOver = true;
        }
        //middle column
        else if (this.checkColumn(1)) {
            this.winner(this.cells[0][1]);
            this.isGameOver = true;
        }
        //right column
        else if (this.checkColumn(2)) {
            this.winner(this.cells[0][2]);
            this.isGameOver = true;
        }
        //diagonal line
        else if (this.cells[0][0].isEqual(this.cells[1][1]) && this.cells[1][1].isEqual(this.cells[2][2])) {
            this.winner(this.cells[0][0]);
            this.isGameOver = true;
        }
        //diagonal line
        else if (this.cells[0][2].isEqual(this.cells[1][1]) && this.cells[1][1].isEqual(this.cells[2][0])) {
            this.winner(this.cells[0][2]);
            this.isGameOver = true;
        }
    }
    //check the row by index -> i=0 upper row, i=1 middle, i=2 bottom row
    checkRow(i: number) {
        return this.cells[i][0].isEqual(this.cells[i][1]) && this.cells[i][1].isEqual(this.cells[i][2]);
    }
    //check the row by index -> j=0 left column, j=1 middle column, j=2 right column
    checkColumn(j: number) {
        return this.cells[0][j].isEqual(this.cells[1][j]) && this.cells[1][j].isEqual(this.cells[2][j]);
    }
    //winner function get the cell with type of the winner, we get into players array
    //and check who from the players array have the type of the cell -> and then we know who's the winner
    winner(cell: Cell) {
        if (cell.element.innerHTML === this.player1.type) {
            this.winningDeclar.innerHTML = `${this.player1.name} is the winner!!!`
        }
        else if (cell.element.innerHTML === this.player2.type) {
            this.winningDeclar.innerHTML = `${this.player2.name} is the winner!!!`
        }
    }
}

class Game {
    //run the game
    isGameStarted: boolean = false;
    board: Board;

    start() {
        this.disableNameInput();
        let playButton = document.querySelector('.play-button');
        playButton.addEventListener('click', () => {
            let player1TypeValue = (<HTMLInputElement>document.querySelector('input[name="competitor"]:checked')).value;
            let player2TypeValue = (<HTMLInputElement>document.querySelector('input[name="competitor2"]:checked')).value;
            let player1Type = player1TypeValue === PlayerType.Computer ? PlayerType.Computer : PlayerType.Manual;
            let player2Type = player2TypeValue === PlayerType.Computer ? PlayerType.Computer : PlayerType.Manual;
            //after we played once, we reset the board
            if (this.isGameStarted) {
                let returnValue = confirm('Are you sure you want to restart the game?');
                if (returnValue) {
                    this.board.reset(player1Type, player2Type);
                }
            }
            //first play -> we create new board, and then initializat all the elements box and cells array
            else {
                this.isGameStarted = true;
                this.board = new Board(player1Type, player2Type);
                this.board.initialization();
            }
        })
    }
    disableNameInput() {
        let leftRadio = document.querySelectorAll('.competitor');
        let rightRadio = document.querySelectorAll('.competitor2');
        let iputNamePlayer1 = document.querySelector('#player1');
        let iputNamePlayer2 = document.querySelector('#player2');
        for (let radio of leftRadio) {
            radio.addEventListener('click', () => {
                if ((<HTMLInputElement>document.querySelector('input[name="competitor"]:checked')).value === PlayerType.Computer) {
                    iputNamePlayer1.setAttribute("disabled", "");
                }
                else {
                    iputNamePlayer1.removeAttribute("disabled");
                }
            })
        }
        for (let radio of rightRadio) {
            radio.addEventListener('click', () => {
                if ((<HTMLInputElement>document.querySelector('input[name="competitor2"]:checked')).value === PlayerType.Computer) {
                    iputNamePlayer2.setAttribute("disabled", "");
                }
                else {
                    iputNamePlayer2.removeAttribute("disabled");
                }
            }
        }
    }
}

//start the game
let game: Game = new Game();
game.start();