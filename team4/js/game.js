class Game{
    constructor(){
        this.players = [];
        this.squares = null;

        this.squares = this.createSquares();

        let go = this.squares[0];
        let player1 = new Player(go);
        this.players.push(player1);
        let rolls = player1.rolldice();
        let total = rolls[0] + rolls[1];
        player1.move(total);
    }
    
    createSquares() {
        let squares = [];
        let square1 = new Square('go', 'Go');
        let square2 = new Square('property', 'Baltic');
        let square3 = new Square('community-chest', 'Community Chest');

        square1.next = square2;
        square2.next = square3;
        square3.next = square1;

        squares.push(square1);
        squares.push(square2);
        squares.push(square3);

        return squares;
    }
}
