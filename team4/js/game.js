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
        // Bindings
        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
        this.showBuyFrame = this.showBuyFrame.bind(this);
        this.showDiceFrame = this.showDiceFrame.bind(this);
        this.showInteractiveFrame = this.showInteractiveFrame.bind(this);
        this.showLocationFrame = this.showLocationFrame.bind(this);
        this.showRentFrame = this.showRentFrame.bind(this);
        this.play = this.play.bind(this);
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
}

class Modal {

	constructor(modalShadow, modalBody, submitPlayers){
        this.modalShadow = modalShadow;
		this.modalBody = modalBody;
        this.playerNumber = 0;
        this.submitPlayers = submitPlayers;
        this.domElmPlayersList = [];
        this.playerNameArray = [];
        this.enterNameIndex = null;
        this.playerIconArray = [];
        this.sendChosenIcons = [];
        this.firstTimeModalClick = null; 
        this.tempIconContainerElm = null;
        this.eventClick = null; 
        this.iconArray = 
        ["player-icons/1.png",
        "player-icons/2.png",
        "player-icons/3.png",
        "player-icons/4.png",
        "player-icons/5.png",
        "player-icons/6.png",
        "player-icons/7.gif",
        "player-icons/8.png",
        "player-icons/9.png",
        "player-icons/10.png",
        "player-icons/11.png",
        "player-icons/12.png"];

        this.submitPlayers = this.submitPlayers.bind(this);
        this.clickHandle = this.clickHandle.bind(this);
        this.displayPlayers = this.displayPlayers.bind(this);
        this.collectPlayersIcon = this.collectPlayersIcon.bind(this);
        this.iconDisplay = this.iconDisplay.bind(this);
        
    }

	show(){

		$(this.modalShadow).show();
        $(this.modalBody).show();
    }
    
	hideModal(){

		$(this.modalShadow).hide();
        $(this.modalBody).hide();
	}
	
	init(){
        this.submitPlayers.click(this.clickHandle);
        this.show();
        this.firstTimeModalClick = true; 
    }

    clickHandle(event) { 
        
        console.log("this event was ",event);
        console.log("Made it to click!");
        
        //TODO: Need to prevent enter when selection icons.
        if (this.firstTimeModalClick){

            this.firstTimeModalClick = false; 
            this.playerNumber = $("input").val();
            this.playerNumberIndex = this.playerNumber;
            
            let tempInputElm = $("<input>")
                .attr({
                    "type": "text",
                    "id": "playerName",
                    "placeholder": "Enter Name Here!"
            });
            this.tempIconContainerElm = $("<div>")
                .addClass("icon-container");
            $("#modalBody").after(this.tempIconContainerElm);
            $("#modalMessage").after(tempInputElm);
            $("#modalMessage").remove();
            $("#submitPlayers").text("ENTER");
            $(".num-of-players").remove();
            //TODO: Toggle playercontainer when done!
        } else {

            let singlePlayerName = $("#playerName").val();
            
            if (singlePlayerName === ""){

                $("#playerName")
                    .attr({"placeholder": "Please Enter A Name!"})
                    .css("background-color", "red");

            } else {

                this.collectPlayerNames(singlePlayerName);
                console.log("Player Name is ", singlePlayerName);
                $(this.tempIconContainerElm).css("display", "flex");
                
                this.iconDisplay();
                


                
                $("#playerName").val("");
                $("#playerName")
                    .attr({"placeholder": "Enter The Next Player Name!"})
                    .css("background-color", "white");
                    this.playerNumberIndex--;
            }
        }
    }

    iconDisplay(){
        
        for (var playerIconIndex = 0; playerIconIndex < this.iconArray.length; playerIconIndex++){

            let tempIconStorage = this.iconArray[playerIconIndex];
            let tempIconDev = $("<div>")
            .addClass("icon")
            .click(this.collectPlayersIcon);
            $(tempIconDev).append("<img id='imageIcon' src='"+tempIconStorage+"'/>");
            $(this.tempIconContainerElm).append(tempIconDev);
        }        
         //TODO: Display the array  
    }

    collectPlayersIcon(event){ 
        //TODO: Save the icons
        this.eventClick = event;
        let getImgElm = $(this.eventClick.currentTarget).children();
        let imagesrc = $(getImgElm).attr("src");

        console.log("Event is ",event);
        console.log("Made it to Icon!");
        this.playerIconArray.push(imagesrc);
        console.log("icon was ", imagesrc);
        let iconToRemove = this.iconArray.indexOf(imagesrc);
        this.iconArray.splice(iconToRemove, 1);
        $(this.tempIconContainerElm).css("display", "none");
        $(".icon").remove();
        if (this.playerNumberIndex === 0){

            console.log("Ended Name Requests");
            this.hideModal();
            this.displayPlayers();
            this.createPlayersArray();
        }
    }

    collectPlayerNames(nameToEnter) { 

        this.playerNameArray.push(nameToEnter);
        console.log("PlayerArray ", this.playerNameArray);
        $(".playersBox").css("display", "block");
    }

    displayPlayers(){ 

        let temp = null;
        this.playerNumberIndex = this.playerNumber;

        for (var displayIndex = 0; displayIndex < this.playerNameArray.length; displayIndex++){
            temp = new Player;
            this.playerColorContainer = temp.createNewPlayerList(this.playerNumber, this.playerNameArray[displayIndex]);
        }
        // while (this.playerNumberIndex > 0){

        //     temp = new Player;
        //     this.playerColorContainer = temp.createNewPlayerList(this.playerNumber, this.playerNameArray[this.playerNumberIndex-1]);
        //     this.playerNumberIndex--;
        // }
        temp.setPlayerList();
    }
    createPlayersArray(){

        for (var playerIndex = 0; playerIndex < this.playerNumber; playerIndex++){

            let findPlayer = playerIndex + 1;
            let tempPlayer = $(".player" + findPlayer);
            this.domElmPlayersList.push(tempPlayer); 
            }

        game.play(this.domElmPlayersList, this.playerNameArray, this.playerIconArray);
    }
}
