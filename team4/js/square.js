class Square {
    constructor(type,title) {
        this.type = type;
        this.title = title;
        this.next = null;
        this.squareDom= null;

    }

    static initSquareData (){
        let squares = [];
        let neighbor = null;
        let lines = SQUARE_DATA.split('\n');
        for ( let lineIndex= lines.length - 1; lineIndex >= 0; lineIndex--){
            let line = lines[lineIndex];
            let props = line.split('\t');
            let square = new Square(props[0],props[1]);
            square.next = neighbor;
            squares.unshift(square);
            neighbor= square; 
        }
        squares[squares.length-1].next = squares[0];
        return squares;
        //console.log ("got in here");
        // let sides = ['.bottomProp', '.sidePropContainer', '.topProp', '.rightPropContainer'];
        // for (let sideIndex =0 ; sideIndex< length.sides ; sideIndex++ ){
        //     let side = sides[sideIndex];
        //     $(side).;
        // }




    }
}