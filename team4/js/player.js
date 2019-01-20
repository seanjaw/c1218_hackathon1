class Player{
    constructor( square, avatar, name, turnEndCallback, domElmPlayerInfo, playerColor){
        // Private Properties
        this._avatar = null;
        this.avatarSmall = null;

        // Passed In Properties
        this.square = square;
        this.avatar = avatar;
        this.name = name;
        this.turnEndCallback = turnEndCallback;
        this.domElmPlayerInfo = domElmPlayerInfo;

        // Derived Properties
        this.createPlayer = null; //Used in createNewPlayerList()
        this.playerColorArray = ["red", "blue", "green", "yellow"];//TODO: setup with player object array Colors used to store in individual players in createPlayer()
        this.money = 1500;
        this.properties = [];
        this.playerColor = playerColor;

        // DOM Properties
        this.playerDom = this.createDOM();
        this.playerDisplayDom = null;

        // Bindings
        this.buyProperty = this.buyProperty.bind(this);
        this.rolldice = this.rolldice.bind(this);
        this.addMoney = this.addMoney.bind(this);
        this.removeMoney = this.removeMoney.bind(this);
    
        this.diceArray = null;
        this.diceTotal = null;
        this.jailCount = 0;

        this.totalColorCount = {
            brown: 2,
            blue: 3,
            pink: 3,
            orange: 3,
            yellow: 3,
            red: 3,
            green: 3,
            grey: 2,
        };

        this.myColorCount = {
            brown: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0]
            },
            blue: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0, 0]
            },
            pink: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0, 0]
            },
            orange: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0, 0]
            },
            yellow: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0, 0]
            },
            red: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0, 0]
            },
            green: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0, 0]
            },
            grey: {
                colorCount: 0,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: [0, 0]
            },
        }
    }

    rolldice(){
        //to:do not hard coded make number of die up there. 
        let rollArray= [];
        let total = 0;
        
        // to do: totally of dice should be done as they are calculated or after via a loop, not hard coded values
        for (let die=0; die< DICE_NUMBER; die++ ){
            let roll = Math.floor(Math.random()*(DICE_NUMBER_OF_SIDES-1)) + 1;
            rollArray.push(roll);
            total+=rollArray[die];
        }
        this.move( total );
        this.diceArray = rollArray;
        this.diceTotal = total;
    }

    rewardFromPassingGo() {
        this.money += 200;
    }
    payTax() {
        this.money -= 200;
    }

    freeParking() {
        return;
    }
    goToJail() {
        this.square = game.squares[10];
    }
    inJail (amount){

        if( this.jailCount === 4 || this.diceArray[0] === this.diceArray[1]){
            this.jailCount = 0;
            this.move(amount);

        } else if ( this.diceArray[0] !== this.diceArray[1]){
            this.jailCount++;
            this.updateDisplay();
        }

    }

    move( amount ){
        var goTrigger = false;
        if(this.jailCount > 0){
            this.inJail(amount);
            return;
        }

        for (let i = 0; i < amount; i++) {
            this.square = this.square.next;
            if(this.square.type === 'go'){
                goTrigger = true;
            }
        }
        if(goTrigger === true){
            this.rewardFromPassingGo();
        } else if (this.square.type === 'income-tax'|| this.square.type === 'luxury-tax') {
            this.payTax();
        } else if (this.square.type === 'parking'){
            this.freeParking();
        } else if (this.square.type === 'go-to-jail'){
            this.updateDisplay();
            game.showLocationFrame();
            this.goToJail();
            this.jailCount++;
        }

        this.updateDisplay();

        if (PROPERTY_TYPES.indexOf(this.square.type) !== -1 && this.square.owner === null && this.money >= this.square.price) {
            game.showBuyFrame();
        } else if (PROPERTY_TYPES.indexOf(this.square.type) !== -1 && this.square.owner !== null) {
            if(this.square.owner === this && this.square.type !== 'street'){
                return;
            }else if(this.square.owner === this && this.suqare.type !== 'utility'){
                game.showBuyFrame();
            } else {
                this.showRentModal();
            }
        } else if (this.square.type === 'community-chest') {
            let card = game.communityChestCards.pop();
            game.showCardFrame(card);
        } else if (this.square.type === 'chance') {
            let card = game.chanceCards.pop();
            game.showCardFrame(card);
        } else {
            game.showLocationFrame();
        }
    }

    /*
     * Buy property for current square
     */
    houseCost() {
        return this.square.price / 2;
    }

    buyHouse(){
        // buy house
        // house price
        var colorInMyColorCount = this.myColorCount[this.square.color];
        var houseCost = this.houseCost();
        this.money -= houseCost;
        colorInMyColorCount.totalHouseCount++;
        // TODO: ADD FUNCTIONALITY FOR DISTRIBUTING HOUSE EVENLY
        var minimum = Math.min.apply(Math, colorInMyColorCount.arrayOfHouseCount);
        var indexOfHouseToAdd = colorInMyColorCount.arrayOfHouseCount.indexOf(minimum);
        colorInMyColorCount.arrayOfHouseCount[indexOfHouseToAdd]++;
        this.square.houseCount++;
    }

    buyHotel(){
        if(this.square.hotelCount === 4){
            return;
        }
        var colorInMyColorCount = this.myColorCount[this.square.color];
        var hotelPrice = this.houseCost();
        this.money -= hotelPrice;
        colorInMyColorCount.totalHotelCount++;
        this.square.hotelCount++;
        this.square.houseCount -= 4;
        colorInMyColorCount.totalHouseCount -= 4;
        /*
        for(var i = 0; i < 4; i++){
            if(i >= colorInMyColorCount.arrayOfHouseCount.length){
                i = i - colorInMyColorCount.arrayOfHouseCount.length;
            }
            colorInMyColorCount.arrayOfHouseCount[i] -= 1;
        }
        */
    }

    buyProperty() {
        var colorInMyColorCount = this.myColorCount[this.square.color];
        if(this.square.type === 'street' && this.totalColorCount[this.square.color] === colorInMyColorCount.colorCount){
/*
            var imageToAppend = $('<div>').css({
                'background-image': 'url(../houseIcon/greenHouse.png)',
                'background-size': 'contain',
                'background-repeat': 'no-repeat',
                'width': '50px',
                'height': '50px',
                'z-index': 10,
            });

            this.square.squareDom.find('.propcolor').append(imageToAppend);
*/
            if(colorInMyColorCount.totalHouseCount === 4){
                this.buyHotel()
            }else {
                this.buyHouse();
            }
            console.log('Buy property: a house on', this.square.title, ' for $', this.square.price/2);
        } else {
            // buy street
            this.money -= this.square.price;
            this.addProperty(this.square);
            if(this.square.type === 'street'){
                colorInMyColorCount.colorCount++;
            }

            console.log('Buy property: ', this.square.title, ' for $', this.square.price);
        }
    }

    sellHouse(property) {
        this.money += property.price / 4;
        property.houseCount--;
        this.myColorCount[property.color].totalHouseCount--;
    }

    sellHotel(property){
        this.money += (property.price) * 5 / 4;
        property.hotelCount--;
        this.myColorCount[property.color].totalHotelCount--;
    }

    calculateRent( property, renter) {
        // Currently basic rent only
        let rent = 0;
        var count = 0;
        if (property.type === 'street') {
            var propertyColor = this.myColorCount[property.color];
            if(property.hotelCount > 0){
                rent = property.rentCosts[property.rentCosts.length - 1];
            }else if(property.houseCount > 0) {
                rent = property.rentCosts[property.houseCount + 1];
            } else if(this.totalColorCount[property.color] === propertyColor.colorCount) {
                rent = property.rentCosts[1];
            } else {
                rent = property.rentCosts[0];
            }
        } else if (property.type === 'railroad') {
            for(var index = 0; index < this.properties.length; index++){
                if(this.properties[index].type === 'railroad'){
                    count++;
                }
            }
            if(count >= 2){
                rent =  property.rentCosts[1];
            } else {
                rent = property.rentCosts[0];
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
     * Receive money from all other players based on a Community Chest or Chance card
     */
    receiveMoneyFromPlayers( amount ) {
        let actualAmount = 0;
        for (let playerIndex = 0; playerIndex < game.players.length; playerIndex++) {
            let player = game.players[playerIndex];
            if (player !== this) {
                actualAmount += player.removeMoney( amount );
            }
        }
        this.addMoney(actualAmount);

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
            position: 'absolute',
            bottom: 0,
            left: 5,
            height: '60px',
            width: '60px',
            'z-index': 4
        });
        $(this.domElmPlayerInfo).text("Money $" + this.money);
        this.highlightPropertiesOwned();
    } 

    highlightPropertiesOwned(){
        
        for (var propertyIndex = 0; propertyIndex < this.properties.length; propertyIndex++){
            let domToChangeColor = this.properties[propertyIndex].squareDom;
            $(domToChangeColor).css("box-shadow", "inset 0 0 1em 0.25em " + color);
        }
    }

    showCardModal(card) {
        // let message =  `${deckName}: ${card.text}`;
        let dialog = $('<div>');
        let cardDisplay = card.createCardDOM();
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
        } else if (card.type === 'receive-players') {
            okCallback = () => {
                dialog.dialog('close');
                this.receiveMoneyFromPlayers(card.amount);
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

    //Creating new player list with accordion settings
    createNewPlayerList(numberOfPlayers){ 
        
        let numOfPlayers = parseInt(numberOfPlayers);

        this.playerDisplayDom = $("<div>")
            .addClass("player" + numOfPlayers)
            .addClass("trackPlayerIndex")
            .text("Input Information");
        
        let currentPlayerIndex = $(".trackPlayerIndex").length;
        this.createPlayer = $("<h1>")
            .css("background-color", this.playerColorArray[currentPlayerIndex])
            .text("Player" + numOfPlayers);        
        $("#accordion").append(this.createPlayer);

        this.playerColor = this.playerColorArray[currentPlayerIndex];

        $(this.createPlayer).after(this.playerDisplayDom);
        
    }

    setPlayerList(){ //Set jQuery UI after players loaded
        $("#accordion").accordion({
            collapsible: "true"
          });
    }

    /**
     * Always set avatar and avatarSmall at same time
     */
    set avatar(newAvatar) {
        this._avatar = newAvatar;
        if (newAvatar) {
            this.avatarSmall = this._avatar.replace('.png', '-face.png');
        }
    }

    get avatar() {
        return this._avatar;
    }
}

