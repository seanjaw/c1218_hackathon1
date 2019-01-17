class Player{
    constructor( square ){
        this.square = square;
    }
    rolldice(){
        let rollArray= [];
        for (let die=0; die<2; die++ ){
            let roll = Math.floor(Math.random()*5) + 1;
            rollArray.push(roll);
        }
        console.log(rollArray);
        return rollArray;
    }
    move( amount ){
        for (let i = 0; i < amount; i++) {
            this.square = this.square.next;
        }
        console.log('After move: ', this.square.title);
    }

}