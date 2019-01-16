class Square {
    constructor( type, title ) {
        this.type = type;
        this.title = title;
        this.next = null;
    }

    static createSquares() {
        let squareHash = {};
        let squareList = [];
        for (let i = 0; i < SQUARE_DATA.length; i++) {
            let data = SQUARE_DATA[i];
            let square = new Square( data.type, data.title);
            squareHash[square.title] = square;
            squareList.push(square);
        }

        
    }
}