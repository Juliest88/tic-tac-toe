interface Player {
    name: string;
    type: string;
}

class Game {
    X: string = '<i class="fa fa-times"></i>';
    O: string = '<i class="fa fa-circle"></i>';
    player1: Player = { name: 'Julia', type: this.X };
    player2: Player = { name: 'Nadav', type: this.O };
    board: string[][] = new Array();
    initGame() {
        let boxes = document.querySelectorAll('.box');
        let turn: number = 0;
        for (let item of boxes) {
            item.addEventListener('click', () => {
                while (item.innerHTML === "") {
                    if (turn === 0) {
                        item.innerHTML = this.player1.type;
                        let posId = item.getAttribute('id');
                        let position = posId.split("_");
                        let i = position[0];
                        let j = position[1];
                        this.board[i][j] = this.player1.type;
                        turn = 1;
                    }
                    else if (turn === 1) {
                        item.innerHTML = this.player2.type;
                        let posId = item.getAttribute('id');
                        let position = posId.split("_");
                        let i = position[0];
                        let j = position[1];
                        this.board[i][j] = this.player2.type;
                        turn = 0;
                    }
                }
            })
        }
    }

}