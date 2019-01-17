class Player{
    constructor( square ){
        this.square = square;
        this.createPlayer = null;
        this.playerColor = ["red", "blue", "green", "yellow"];
        this.money = 1500;
        this.properties = [];

        this.playerDom = this.createDOM();

        this.buyProperty = this.buyProperty.bind(this);
    }

    rolldice(){
        let rollArray= [];
        for (let die=0; die<2; die++ ){
            let roll = Math.floor(Math.random()*5) + 1;
            rollArray.push(roll);
        }

        return rollArray;
    }

    move( amount ){
        for (let i = 0; i < amount; i++) {
            this.square = this.square.next;
        }

        const {square} = this;
        if (PROPERTY_TYPES.indexOf(square.type) !== -1 && square.owner === null && this.money >= square.price) {
            this.showBuyModal();
        }

        this.updateDisplay();      
    }

    /*
     * Buy property for current square
     */
    buyProperty() {
        this.money -= this.square.price;
        this.addProperty(this.square);
        console.log('Buy property: ', this.square.title, ' for $', this.square.price);
    }

    /*
     * Player will manage bi-directional Player:Property relationship
     */
    addProperty( square ) {
        this.properties.push( square );
        square.owner = this;
    }

    /*
     * Player will manage bi-directional Player:Property relationship
     */
    removeProperty( square ) {
        this.properties = this.properties.filter(property => property !== square);
        square.owner = null;
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

    showBuyModal() {
        let message =  `Buy '${this.square.title}' for \$${this.square.price}?`;
        let dialog = $('<div>').text(message);

        let buyCallback = () => {
            dialog.dialog('close');
            this.buyProperty();
        };

        let auctionCallback = () => {
            dialog.dialog('close');
        };

        dialog.dialog({
            modal: true, 
            dialogClass: "no-close", 
            height: 300,
            buttons: [
                {text: "Buy", click: buyCallback},
                {text: "Auction", click: auctionCallback}
            ]
        });
    }

    //Creating new player with accordion settings
    createNewPlayer(){ 
        if ($("h1").length > 3){

            console.error("Can only have 4 players!");
            
        } else { 

        let numOfPlayers = $("h1").length + 1;
        
        this.createPlayer = $("<h1>")
            .css("background-color", this.playerColor[$("h1").length])
            .text("Player" + numOfPlayers);        
        $("#accordion").append(this.createPlayer);
        }
    }

    setPlayerList(){
        $("#accordion").accordion();
    }
}

