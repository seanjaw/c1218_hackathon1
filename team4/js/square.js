class Square {
    constructor( type, title, next ) {
        this.type = type;
        this.title = title;
        this.next = next;
        this.squareDom= null;
    }
    static initSquareData (){
        console.log ("got in here");
        let sides = ['.bottomProp', '.sidePropContainer', '.topProp', '.rightPropContainer'];
        for (let sideIndex =0 ; sideIndex< length.sides ; sideIndex++ ){
            let side = sides[sideIndex];
            $(side).find('.square');
            

        }




    }
}