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
        this.playerDom = this.createDOM();if (this.playerNumberIndex === 0){

            console.log("Ended Name Requests");
            this.hideModal();
            this.displayPlayers();
            this.createPlayersArray();
        }
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

        this.railroadCount = 0;
        this.utilityCount = 0;
        this.myColorCount = {
            brown: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Luna': 0,
                    'Sailor Pluto': 0
                },
                objectOfHotelCount: {
                    'Luna': 0,
                    'Sailor Pluto': 0
                }
            },
            blue: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Sailor Neptune': 0,
                    'Sailor Uranus': 0,
                    'Sailor Saturn': 0
                },
                objectOfHotelCount: {
                    'Sailor Neptune': 0,
                    'Sailor Uranus': 0,
                    'Sailor Saturn': 0
                }
            },
            pink: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Sailor Mercury': 0,
                    'Chibiusa': 0,
                    'Sailor Venus': 0
                },
                objectOfHotelCount: {
                    'Sailor Mercury': 0,
                    'Chibiusa': 0,
                    'Sailor Venus': 0
                }
            },
            orange: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Sailor Mars': 0,
                    'Sailor Jupiter': 0,
                    'Sailor Moon': 0
                },
                objectOfHotelCount: {
                    'Sailor Mars': 0,
                    'Sailor Jupiter': 0,
                    'Sailor Moon': 0
                }
            },
            yellow: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Tuxedo': 0,
                    'Usagi': 0,
                    'Jupiter and Venus': 0
                },
                objectOfHotelCount: {
                    'Tuxedo': 0,
                    'Usagi': 0,
                    'Jupiter and Venus': 0
                }
            },
            red: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Sad Jupiter': 0,
                    'Happy Venus': 0,
                    'Artemis': 0
                },
                objectOfHotelCount: {
                    'Sad Jupiter': 0,
                    'Happy Venus': 0,
                    'Artemis': 0
                }
            },
            green: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Eating Usagi': 0,
                    'Kamen': 0,
                    'Queen Serenity': 0
                },
                objectOfHotelCount: {
                    'Eating Usagi': 0,
                    'Kamen': 0,
                    'Queen Serenity': 0
                }
            },
            grey: {
                colorCount: 0,
                mortgaged: false,
                totalHouseCount: 0,
                totalHotelCount: 0,
                arrayOfHouseCount: {
                    'Mercury and Mars': 0,
                    'Princess': 0
                },
                objectOfHotelCount: {
                    'Mercury and Mars': 0,
                    'Princess': 0
                }
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
        game.displayCurrentMoney();
    }
    payTax() {
        this.money -= 200;
        game.displayCurrentMoney();
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
            }else if(this.square.owner === this && this.square.type !== 'utility'){
                game.showBuyFrame();
            } else {
                game.showRentFrame();
                /*
                if(this.square.mortgaged === false){
                    game.showRentFrame();
                } else {
                    game.showLocationFrame();
                }
                */
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
        game.displayCurrentMoney();
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
        // ADD FUNCTIONALITY FOR DISTRIBUTING HOUSE EVENLY
        //var minimum = Math.min.apply(Math, colorInMyColorCount.arrayOfHouseCount);
        //var indexOfHouseToAdd = colorInMyColorCount.arrayOfHouseCount.indexOf(minimum);
        var minHouseCount = this.square.title;
        for(var key in colorInMyColorCount.arrayOfHouseCount){
            if(colorInMyColorCount.arrayOfHouseCount[minHouseCount] > colorInMyColorCount.arrayOfHouseCount[key]){
                minHouseCount = key;
            }
        }
        colorInMyColorCount.arrayOfHouseCount[minHouseCount]++;

        for(var index = 0; index < game.squares.length; index++){
            if(game.squares[index].title === minHouseCount){
                var squareToAddHouse = game.squares[index];
                break;
            }
        }
        squareToAddHouse.houseCount++;
        game.displayCurrentMoney();
    }

    deductHouseCount(remainingHouseToDeduct) {
        var colorInMyColorCount = this.myColorCount[this.square.color];
        var numberOfHouseToDeduct = null;
        for(var key in colorInMyColorCount.arrayOfHouseCount){
            if(remainingHouseToDeduct === 0){
                break;
            }
            if(colorInMyColorCount.arrayOfHouseCount[key] > 0){
                if(remainingHouseToDeduct > colorInMyColorCount.arrayOfHouseCount[key]){
                    remainingHouseToDeduct = remainingHouseToDeduct - colorInMyColorCount.arrayOfHouseCount[key];
                    numberOfHouseToDeduct = colorInMyColorCount.arrayOfHouseCount[key];
                    colorInMyColorCount.arrayOfHouseCount[key] = 0;
                } else {
                    colorInMyColorCount.arrayOfHouseCount[key] = colorInMyColorCount.arrayOfHouseCount[key] - remainingHouseToDeduct;
                    numberOfHouseToDeduct = remainingHouseToDeduct;
                    remainingHouseToDeduct = 0;
                }
                for(var index = 0; index < game.squares.length; index++){
                    if(game.squares[index].title === key){
                        var squareToDeductHouse = game.squares[index];
                        squareToDeductHouse.houseCount -= numberOfHouseToDeduct;
                        break;
                    }
                }

            }
        }
        game.displayCurrentMoney();
    }

    buyHotel(){
        if(this.square.hotelCount === 4){
            return;
        }
        var colorInMyColorCount = this.myColorCount[this.square.color];
        var hotelPrice = this.houseCost();
        this.money -= hotelPrice;
        colorInMyColorCount.totalHotelCount++;
        colorInMyColorCount.objectOfHotelCount[this.square.title]++;
        this.square.hotelCount++;
        //this.square.houseCount -= 4;

        var remainingHouseToDeduct = 4 - this.square.houseCount;
        this.square.houseCount = 0;
        colorInMyColorCount.arrayOfHouseCount[this.square.title] = 0;
        this.deductHouseCount(remainingHouseToDeduct);
        colorInMyColorCount.totalHouseCount -= 4;
        game.displayCurrentMoney();
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
            if(this.square.type === 'railroad'){
                this.railroadCount++;
            } else if (this.square.type === 'utility'){
                this.utilityCount++;
            }
            this.square.owner = this;
            if(this.square.type === 'street'){
                colorInMyColorCount.colorCount++;
            } else if (this.square.type === 'railroad'){
                this.railroadCount++;
            } else if (this.square.type === 'utility') {
                this.utilityCount++;
            }


            console.log('Buy property: ', this.square.title, ' for $', this.square.price);
        }
        game.displayCurrentMoney();
    }

    mortgage(property){
        this.money += property.price / 2;
        property.mortgaged = true;
        this.myColorCount[property.color].mortgaged = true;
    }

    unmortgage(property){
        var interest = (property.price / 2) * 0.1;
        var total = interest + property.price/2;
        this.money -= total;
        property.mortgaged = false;
        this.myColorCount[property.color].mortgaged = false;
    }

    sellHouse(property) {
        this.money += property.price / 4;
        property.houseCount--;
        this.myColorCount[property.color].totalHouseCount--;
        this.myColorCount[property.color].arrayOfHouseCount[property.title]--;
        game.displayCurrentMoney();
    }

    sellHotel(property){
        this.money += (property.price) * 5 / 4;
        property.hotelCount--;
        this.myColorCount[property.color].totalHotelCount--;
        this.myColorCount[property.color].objectOfHotelCount[property.title]--;
        game.displayCurrentMoney();
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
            if(count === 4){
                rent = 20 * renter.diceTotal;
            } else if (count ===3){
                rent = 15 * renter.diceTotal;
            } else if(count === 2){
                rent = 10 * renter.diceTotal;
            } else {
                rent = 4 * renter.diceTotal;
            }
        }
        if(property.mortgaged === true){
            rent = 0;
        }
        if(renter.money < rent){
            rent = renter.money;
        }
        game.displayCurrentMoney();

        return rent;
    }

    /*
     * Pay rent to owner of current square
     */
    payRent() {
        let square = this.square;


        let rent = square.owner.calculateRent(square, this);

        // TODO: Mortgage property or lose if not enough money to pay rent
        if(square.mortgaged === true){
            rent = 0;
        }

        let amountToPay = rent;
        if (this.money < amountToPay) {
            amountToPay = this.money;
        }
        this.money -= amountToPay;

        square.owner.money += amountToPay;

        if(this.money === 0){
            game.showLostFrame();
        }
        for(var i = 0; i < this.square.owner.properties.length; i++){
            console.log(this.square.owner.properties[i].type);
        }
        game.displayCurrentMoney();
        this.turnEndCallback();
        this.displayCurrentMoney();
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
        game.displayCurrentMoney();
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
        game.displayCurrentMoney();
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
        game.displayCurrentMoney();
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
        });

        $('body').append(dom);
        return dom;
    }

    updateDisplay() {
        this.square.squareDom.append(this.playerDom);
        $(this.domElmPlayerInfo).text("Money $" + this.money);
        this.highlightPropertiesOwned();
    } 

    highlightPropertiesOwned(){
        let color = this.playerColor;
        for (var propertyIndex = 0; propertyIndex < this.properties.length; propertyIndex++){
            let domToChangeColor = this.properties[propertyIndex].squareDom;
            $(domToChangeColor).css("box-shadow", "inset 0 0 1em 0.25em " + color);
        }
    }

    //Creating new player list with accordion settings
    createNewPlayerList(numberOfPlayers, playerName, className){ 
        
        let numOfPlayers = parseInt(numberOfPlayers);

        this.playerDisplayDom = $("<div>")
            .addClass(className)
            .addClass("trackPlayerIndex")
            .text("Input Information");
        
        let currentPlayerIndex = $(".trackPlayerIndex").length;
        this.createPlayer = $("<h1>")
            .css("background-color", this.playerColorArray[currentPlayerIndex])
            .text(playerName);        
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

