class Game{
    constructor(){
        this.players = [];
        Square.initSquareData();
        let go = SQUARE_DATA['Go'];
        let player1 = new Player(go);
        this.players.push(player1);
        for (let i = 0; i < 8; i++) {
            let rolls = player1.rolldice();
            let total = rolls[0] + rolls[1];
            player1.move(total);
        }
    }
}
