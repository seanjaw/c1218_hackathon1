class Player{
    constructor( square ){
        this.square = square;
        this.createPlayer = null;
        this.playerColor = ["red", "blue", "green", "yellow"];
        this.playerDom = this.createDOM();
        this.money = 1500;
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

    createNewPlayer(){ 
        if ($("h1").length > 3){
            console.error("Can only have 4 players!")
        } else { //Creating new player with accordion settings
        let numOfPlayers = $("h1").length + 1;
        
        this.createPlayer = $("<h1>")
            .css("background-color", this.playerColor[$("h1").length])
            .text("Player" + numOfPlayers);
        // this.createNewPlayer.append(spanElem);
        
        $("#accordion").append(this.createPlayer);
        }
    }

    setPlayerList(){
        $("#accordion").accordion();
    }
}

