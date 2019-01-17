class Player{
    constructor( square ){
        this.square = square;
        this.playerDom = this.createDOM();
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
        this.updateDisplay();      
    }
    createDOM() {
        let dom = $('<div>');
        dom.addClass('player');
        dom.css({
            'background-image': 'url(images/icon1.png)'
        });
        $('body').append(dom);
        return dom;
    }
    updateDisplay() {
        this.square.squareDom.append(this.playerDom);
        this.playerDom.css({
            position: 'relative',
            'background-position': 'contain',
            'border': '5px solid red',
            top: 5,
            left: 5,
            height: '10px',
            width: '10px',
            'z-index': 9999
        });
    }
}