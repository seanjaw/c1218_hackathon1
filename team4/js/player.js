class Player{
    constructor( square, avatar, name, turnEndCallback, domElmPlayerInfo){

        this.square = square;
        this.avatar = avatar;
        this.name = name;
        this.turnEndCallback = turnEndCallback;
        this.domElmPlayerInfo = domElmPlayerInfo;

        this.createPlayer = null;
        this.playerColor = ["red", "blue", "green", "yellow"];
        this.money = 1500;
        this.properties = [];
        this.active = true;

        this.playerDom = this.createDOM();

        this.buyProperty = this.buyProperty.bind(this);
        this.rolldice = this.rolldice.bind(this);
        this.addMoney = this.addMoney.bind(this);
        this.removeMoney = this.removeMoney.bind(this);

        this.diceArray = null;
        this.diceTotal = null;


    }

    rolldice(){
        let rollArray= [];
        for (let die=0; die<2; die++ ){
            let roll = Math.floor(Math.random()*5) + 1;
            rollArray.push(roll);
        }

        let total = rollArray[0] + rollArray[1];
        this.move( total );
        this.diceArray = rollArray;
        this.diceTotal = total;
    }

    move( amount ){
        for (let i = 0; i < amount; i++) {
            this.square = this.square.next;
        }

        console.log('Player ', this.name, ' is at ', this.square.title);

        this.updateDisplay();

        if (PROPERTY_TYPES.indexOf(this.square.type) !== -1 && this.square.owner === null && this.money >= this.square.price) {
            this.showBuyModal();
        } else if (PROPERTY_TYPES.indexOf(this.square.type) !== -1 && this.square.owner !== null) {
            this.showRentModal();
        } else if (this.square.type === 'community-chest') {
            let card = game.communityChestCards.pop();
            this.showCardModal( 'Community Chest', card);
        } else if (this.square.type === 'chance') {
            let card = game.chanceCards.pop();
            this.showCardModal( 'Chance', card);
        } else {
            this.showLocationModal();
        }       
    }

    getCurrentMoney() {
        return this.money;
    }
    /*
     * Buy property for current square
     */
    buyProperty() {
        this.money -= this.square.price;
        this.addProperty(this.square);
        console.log('Buy property: ', this.square.title, ' for $', this.square.price);
    }

    calculateRent( property, renter) {
        // Currently basic rent only
        let rent = 0;
        var count = 0;
        var totalColorCount = {
            brown: 2,
            blue: 3,
            orange: 3,
            yellow: 3,
            redCount: 3,
            greenCount: 3,
            greyCount: 2,
        };
        if (property.type === 'street') {
            var propertyColor = property.color;
            for(var index = 0; index < this.properties.length; index++){
                if(this.properties[index].type === 'street' && propertyColor === this.properties[index].color){
                    count++;
                }
            }
            if(count === totalColorCount[propertyColor]){
                rent = parseInt(property.rentCosts[0]) * 2;
            } else {
                rent = parseInt(property.rentCosts[0]);
            }

        } else if (property.type === 'railroad') {
            for(var index = 0; index < this.properties.length; index++){
                if(this.properties[index].type === 'railroad'){
                    count++;
                }
                if(count >= 2){
                    rent =  property.rentCosts[0] * 2;
                } else {
                    rent = property.rentCosts[0];
                }
            }
        } else if (property.type === 'utility') {
            // TODO: Store current die rolls for players
            // TODO: Calculte this rent based on renter's dice roll & 
            //       number of utilities in this player's properties
            for(var index=0; index<this.properties.length; index++){
                if(this.properties[index].type === 'utility'){
                    count++;
                }
            }
            if(count >= 2){
                rent = 10 * renter.diceTotal;
            } else {
                rent = 4 * renter.diceTotal;
            }
        }


        return rent;
    }

    /*
     * Pay rent to owner of current square
     */
    payRent() {
        let square = this.square;
        let rent = square.owner.calculateRent(square, this);

        // TODO: Mortgage property or lose if not enough money to pay rent
        let amountToPay = rent;
        if (this.money < amountToPay) {
            amountToPay = this.money;
        }
        this.money -= amountToPay;
        square.owner.money += amountToPay;
        for(var i = 0; i < this.square.owner.properties.length; i++){
            console.log(this.square.owner.properties[i].type);
        }
        this.turnEndCallback();


    }

    /*
     * Pay all other players an amount based on a Community Chest or Chance card
     */
    payOtherPlayers( amount ) {
        console.log("TODO: Implement Player.payOtherPlayers");

        this.turnEndCallback();
    }

    /**
     * Add money to this user
     * TODO: Potentially trigger animation here
     * @param {number} amount - Amount of money to add 
     */
    addMoney( amount ) {
        this.money += amount;
        console.log('In addMoney');
    }

    /**
     * Remove money from this user, only up to this player's current amount
     * TODO: Potentially trigger animation here
     * @param {number} amount - Amount of money to add 
     * @return {number} - Amount actually removed
     */
    removeMoney( amount ) {
        let amountToRemove = amount;
        if (amount > this.money) {
            amountToRemove = this.money;
        }
        this.money -= amountToRemove;

        console.log('In removeMoney');
        return amountToRemove;
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
            'background-image': `url(${this.avatar})`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat'
        });

        $('body').append(dom);
        return dom;
    }

    updateDisplay() {
        this.square.squareDom.append(this.playerDom);
        this.playerDom.css({
            position: 'relative',
            top: 5,
            left: 5,
            height: '60px',
            width: '60px',
            'z-index': 2
        });
    } 

    showDiceModal() {
        let message =  `Roll Dice`;
        let dialog = $('<div>').text(message);

        let rollDiceCallback = () => {
            dialog.dialog('close');
            this.rolldice();
        };

        dialog.dialog({
            modal: true, 
            dialogClass: "no-close", 
            height: 300,
            buttons: [{text: "Roll Dice", click: rollDiceCallback}]
        });
    }

    showCardModal(deckName, card) {
        let message =  `${deckName}: ${card.text}`;
        let dialog = $('<div>').text(message);
        let cardDisplay = Card.createCardDOM(deckName, card);
        dialog.append(cardDisplay);
        let okCallback;
        if (card.type === 'pay-bank') {
            okCallback = () => {
                dialog.dialog('close');
                this.removeMoney(card.amount);
                this.turnEndCallback();
            };
        } else if (card.type === 'receive-bank') {
            okCallback = () => {
                dialog.dialog('close');
                this.addMoney(card.amount);
                this.turnEndCallback();
            };            
        } else if (card.type === 'pay-players') {
            okCallback = () => {
                dialog.dialog('close');
                this.payOtherPlayers(card.amount);
                this.turnEndCallback();
            }; 
        }

        dialog.dialog({
            modal: true, 
            dialogClass: "no-close", 
            height: 300,
            buttons: [{text: "OK", click: okCallback}]
        });
    }

    showRentModal() {
        let square = this.square;
        let rent = square.owner.calculateRent(square, this);

        let message =  `${this.name} pay ${square.owner.name} rent of \$${rent} for ${square.title}`;
        let dialog = $('<div>').text(message);

        let okCallback = () => {
            dialog.dialog('close');
            this.payRent();
        };

        dialog.dialog({
            modal: true, 
            dialogClass: "no-close", 
            height: 300,
            buttons: [{text: "OK", click: okCallback}]
        });
    }

    showBuyModal() {
        let message =  `Buy '${this.square.title}' for \$${this.square.price}?`;
        let dialog = $('<div>').text(message);
        if(this.square.type === 'street'){
            let deed = Square.createDeed(this.square);
            dialog.append(deed);
        }
        let buyCallback = () => {
            dialog.dialog('close');
            this.buyProperty();
            this.turnEndCallback();
        };

        let auctionCallback = () => {
            dialog.dialog('close');
            this.turnEndCallback();
        };

        dialog.dialog({
            modal: true, 
            dialogClass: "no-close", 
            height: 520,
            buttons: [
                {text: "Buy", click: buyCallback},
                {text: "Auction", click: auctionCallback}
            ]
        });
    }

    showLocationModal() {
        let message =  `Landed on '${this.square.title}'`;
        let dialog = $('<div>').text(message);

        let okCallback = () => {
            dialog.dialog('close');
            this.turnEndCallback();
        };

        dialog.dialog({
            modal: true, 
            dialogClass: "no-close", 
            height: 300,
            buttons: [{text: "OK", click: okCallback}]
        });
    }

    //Creating new player with accordion settings
    createNewPlayerList(){ 

        if ($("h1").length > 3){

            console.error("Can only have 4 players!");
            
        } else { 

        let numOfPlayers = $("h1").length + 1;
        let divToAppend = $("<div>").text("Player Information");

        this.createPlayer = $("<h1>")
            .css("background-color", this.playerColor[$("h1").length])
            .addClass("player" + numOfPlayers)
            .text("Player" + numOfPlayers);        
        $("#accordion").append(this.createPlayer);
        $(this.createPlayer).after(divToAppend);
        }
    }

    setPlayerList(){
        $("#accordion").accordion({
            collapsible: "true"
          });
    }
}

