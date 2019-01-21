const COMMUNITY_CHEST_NAME = 'LOVE';
const CHANCE_NAME = 'FRIENDSHIP'
const DICE_NUMBER = 2;
const DICE_NUMBER_OF_SIDES= 6;
class Game{
    constructor(){
        this.players = [];
        this.playerColorArray = ["red", "blue", "green", "yellow"];
        this.communityChestCards = Card.initCards(COMMUNITY_CHEST_NAME, COMMUNITY_CHEST_DATA);
        this.chanceCards = Card.initCards(CHANCE_NAME, CHANCE_DATA);
        this.currentPlayerIndex = 0;
        this.squares = Square.initSquareData(); 
        this.domElmPlayersList = [];
        this.playerNameArray = [];
        this.storeDiceSound = null;
        this.storeMoneySound = null;
        // Bindings
        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
        this.showBuyFrame = this.showBuyFrame.bind(this);
        this.showDiceFrame = this.showDiceFrame.bind(this);
        this.showInteractiveFrame = this.showInteractiveFrame.bind(this);
        this.showLocationFrame = this.showLocationFrame.bind(this);
        this.showRentFrame = this.showRentFrame.bind(this);
        this.play = this.play.bind(this);
        this.diceSound = this.diceSound.bind(this);
        this.moneySound = this.moneySound.bind(this)
    }

    play(addPlayers, playerNames, playerIcons) {
        this.playerNameArray = playerNames;
        this.domElmPlayersList = addPlayers;
        let go = this.squares[0];
        for (var playerIndex = 0; playerIndex < this.domElmPlayersList.length; playerIndex++){
            let tempName = this.playerNameArray[playerIndex];
            let iconName = playerIcons[playerIndex];
            let newPlayer =  new Player(go, iconName, tempName, this.handlePlayerTurnEnd, this.domElmPlayersList[playerIndex], this.playerColorArray[playerIndex]);
            this.players.push(newPlayer);
            newPlayer.updateDisplay();
        }

        this.showDiceFrame();
    }
    //remove player if their money goes below zero. 
    //remove and update display. if there is only one player left, they lose 


    handlePlayerTurnEnd() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
        }
        
        this.displayCurrentMoney();
        this.showDiceFrame();
    }
  
    /**
     * Show main dialog in center of board
     * @param {string} title - Title for dialog
     * @param {*} content - DOM content for dialog
     * @param {*} buttons - {buttonLabel1: callback1, ..., buttonLabelN: callbackN}
     * @param {boolean} dissolve - Dissolve out and back in between content?
     */
    showFrame( title, content, buttons, dissolve ) {
        let dialog = $('.action-dialog-container');

        function doDisplay() {
            if (dissolve) {
                dialog.css({display: 'none'});
            }

            // Avatar
            dialog.find('.avatar .image').css({
                'background-image': `url(${game.currentPlayer.avatarSmall})`,
                'background-color': game.currentPlayer.playerColor
            });
            dialog.find('.avatar .name').text(game.currentPlayer.name);

            // Buttons
            let buttonsSection = dialog.find('.buttons');
            buttonsSection.empty();
            for (let buttonName in buttons) {
                let callback = buttons[buttonName];
                let button = $('<button>')
                    .text(buttonName)
                    .click(callback);
                buttonsSection.append(button);
            }

            // Content
            dialog.find('.action > .content').empty().append(content);

            // Title
            let titleDiv = dialog.find('.action > .title');
            titleDiv.empty();
            if (!Array.isArray(title)) {
                title = [title];
            }
            title.forEach(text => titleDiv.append($('<span>').text(text)));

            if (dissolve) {
                dialog.fadeIn(1000);
            } else {
                dialog.css({display: 'block'});
            }
        }

        if (dissolve) {
            dialog.fadeOut(1000, doDisplay);
        } else {
            doDisplay();
        }
    }

    makeSellPropertyTable() {
        var player = game.currentPlayer;
        var divToHoldTable = $('<div>');
        var table = $('<table>');
        var firstRow = $('<tr>');
        var firstRowTitle = $('<td>').text('Title').css('font-size', '75%');
        var firstRowHouse = $('<td>').text('House').css('font-size', '75%');
        var firstRowHotel = $('<td>').text('Hotel').css('font-size', '75%');
        firstRow.append(firstRowTitle, firstRowHouse,firstRowHotel);
        table.append(firstRow);
        for(var key in player.myColorCount){
            for(var insideKey in player.myColorCount[key].arrayOfHouseCount){
                if( player.myColorCount[key].arrayOfHouseCount[insideKey] > 0 || player.myColorCount[key].objectOfHotelCount[insideKey] > 0){

                    var row = $('<tr>');
                    var cellTitle = $('<td>').text(insideKey).addClass('title').css('font-size', '75%');
                    var cellHouseValue = $('<td>').text(player.myColorCount[key].arrayOfHouseCount[insideKey]).addClass('value').css('font-size', '75%');
                    var cellHotelValue = $('<td>').text(player.myColorCount[key].objectOfHotelCount[insideKey]).addClass('hotelValue').css('font-size', '75%');
                    var cellButton = $('<td>');
                    var cellHotelButton = $('<td>');
                    var button = $('<button>').text('Sell 1 House').css('font-size', '65%');
                    var hotelButton = $('<button>').text('Sell 1 Hotel').css('font-size', '65%');
                    cellButton.append(button);
                    cellHotelButton.append(hotelButton);
                    row.append(cellTitle, cellHouseValue, cellHotelValue, cellButton, cellHotelButton);

                    $(button).click(this.sellButtonClickHandler);
                    $(hotelButton).click(this.sellHotelButtonClickHandler);

                    table.append(row);
                }
            }
        }
        divToHoldTable.append(table);
        return divToHoldTable;
    }

    sellHotelButtonClickHandler(){
        if($(this).parents('tr').find('.hotelValue').text() === '0'){
            return;
        }
        var title = $(this).parents('tr').find('.title').text();

        for(var index = 0; index < game.squares.length; index++){
            if(game.squares[index].title === title){
                var squareToSellHotel = game.squares[index];
                break;
            }
        }
        game.currentPlayer.sellHotel(squareToSellHotel);
        var value = $(this).parents('tr').find('.hotelValue').text() - 1;
        $(this).parents('tr').find('.hotelValue').text(value);
        this.moneySound();
    }

    sellButtonClickHandler(){
        if($(this).parents('tr').find('.value').text() === '0'){
            return;
        }
        var title = $(this).parents('tr').find('.title').text();

        for(var index = 0; index < game.squares.length; index++){
            if(game.squares[index].title === title){
                var squareToSellHouse = game.squares[index];
                break;
            }
        }
        game.currentPlayer.sellHouse(squareToSellHouse);
        var value = $(this).parents('tr').find('.value').text() - 1;
        $(this).parents('tr').find('.value').text(value);
        this.moneySound();
    }
    /**
     * Show dialog that allows current player to conduct business or select End Turn
     */
    showInteractiveFrame() {
        // TODO: Add Mortgage|Unmortgage|Trade buttons here
        var tableData = this.makeSellPropertyTable();

        let title = 'Please select an action';
        let content = tableData;
        let buttons = {
            'End Turn': game.handlePlayerTurnEnd,
        };
        this.currentPlayer.updateDisplay();
        this.showFrame(title, content, buttons);
    }

    /**
     * Show frame that allows current player to roll dice
     */
    showDiceFrame() {
        let title = '';
        let content = $('<div>').addClass('dice');
        let buttons = {'Roll Dice': game.currentPlayer.rolldice};
        this.showFrame(title, content, buttons, true);
        this.diceSound();
    }

    /**
     * Show frame that allows current player to buy or pass on current property
     */
    showBuyFrame() {
        // TODO: Implement property auction on Pass
        let player = this.currentPlayer;
        let square = player.square;

        let title = `Buy ${square.title}?`;
        let content = null;

        if (square.type === 'street') {
            title = '';
            content = player.square.deedDOM;
        }
        if (square.type === 'railroad') {
            title = '';
            content = player.square.railroadDOM;
        }
        if (square.type === 'utility') {
            title = '';
            content = player.square.utilityDOM;
        }

        let buttons = {
            'Buy': () => {
                player.buyProperty();
                game.showInteractiveFrame();
                this.moneySound();
            },
            'Pass': game.showInteractiveFrame
        }

        this.showFrame(title, content, buttons);

    }

    /**
     * Show frame that allows current player to buy or pass on current property
     */
    showCardFrame(card) {
        let title = '';
        let content = card.cardDOM;
 
        let okCallback;
        if (card.type === 'pay-bank') {
            okCallback = () => {
                game.currentPlayer.removeMoney(card.amount);
                game.showInteractiveFrame();
            };
        } else if (card.type === 'receive-bank') {
            okCallback = () => {
                game.currentPlayer.addMoney(card.amount);
                game.showInteractiveFrame();
            };            
        } else if (card.type === 'receive-players') {
            okCallback = () => {
                game.currentPlayer.receiveMoneyFromPlayers(card.amount);
                game.showInteractiveFrame();
            }; 
        }

        this.showFrame( title, content, {'OK': okCallback} );
    }

    /**
     * Show frame that indicates location player moved to if there is no action involved
     */
    showLocationFrame() {
        //TODO: Code for handling square visualization should go with Square or Property objects
        //      However, need to refactor code to do so.  For instance,
        //      if player landed on Go To Jail, by the time they reach this dialog, they are already in Jail.

        //TODO: Need to handle STILL IN JAIL
        const CORNERS = ['go','jail','go-to-jail','parking'];

        let square = game.currentPlayer.square;
        let content = null;

        if (CORNERS.indexOf(square.type) !== -1) {

            if (game.currentPlayer.jailCount == 1 && square.type == 'jail') {
                square = game.squares.filter(square => square.type == 'go-to-jail')[0];
            }

            content = $('<div>')
                .addClass('image')
                .css({'background-image': 'url(images/' + square.type + '.png)'});
        }

        let title = `Landed on ${square.title.toUpperCase()}`;
        game.showFrame(title, content, {'OK': game.showInteractiveFrame});
    }

    /**
     * Show frame to indicate rent being paid
     */
    showRentFrame() {
        let renter = this.currentPlayer;
        let square = renter.square;
        let rent = square.owner.calculateRent(square, renter);

        let title = [
            `Pay \$${rent} Rent`,
            'to',
            square.owner.name
        ];
        let content = null;

        let okCallback = () => {
            renter.payRent();
            game.showInteractiveFrame();
        };

        game.showFrame(title, content, {'OK': okCallback});
    }

    get currentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    displayCurrentMoney(){
        let currentPlayer = this.players[this.currentPlayerIndex];
        let currentMoney = (currentPlayer.money).toString();
        let currentDomElmPlayer = currentPlayer.domElmPlayerInfo[game.currentPlayerIndex];
        $(currentDomElmPlayer).text("Money $" + currentMoney);
    }
    diceSound(){
        this.storeDiceSound = new Audio("sound/diceSound.wav");
        this.storeDiceSound.play();
    }
    moneySound(){
        this.storeMoneySound = new Audio("sound/moneySound.wav");
        this.storeMoneySound.play();
    }
}