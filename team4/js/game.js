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
        this.iconArray = ["player-icons/1.png",
        "player-icons/2.png",
        "player-icons/3.png",
        "player-icons/4.png",
        "player-icons/5.png",
        "player-icons/6.png",
        "player-icons/7.gif",
        "player-icons/7.png",
        "player-icons/8.png",
        "player-icons/9.png",
        "player-icons/10.png",
        "player-icons/11.png",
        "player-icons/12.png"];

        // Bindings
        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
        this.showBuyFrame = this.showBuyFrame.bind(this);
        this.showDiceFrame = this.showDiceFrame.bind(this);
        this.showInteractiveFrame = this.showInteractiveFrame.bind(this);
        this.showLocationFrame = this.showLocationFrame.bind(this);
        this.showRentFrame = this.showRentFrame.bind(this);
        this.play = this.play.bind(this);
    }

    play(addPlayers, playerNames) {
        this.playerNameArray = playerNames;
        this.domElmPlayersList = addPlayers;
        let go = this.squares[0];
        for (var playerIndex = 0; playerIndex < this.domElmPlayersList.length; playerIndex++){
            let tempName = this.playerNameArray[playerIndex];
            let iconName = this.iconArray[playerIndex];
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

    /**
     * Show dialog that allows current player to conduct business or select End Turn
     */
    showInteractiveFrame() {
        // TODO: Add Mortgage|Unmortgage|Trade buttons here

        let title = 'Please select an action';
        let content = $('<div>');
        let buttons = {'End Turn': game.handlePlayerTurnEnd};
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
        this.firstTimeModalClick = null; 
        this.submitPlayers = this.submitPlayers.bind(this);
        this.clickHandle = this.clickHandle.bind(this);
        this.displayPlayers = this.displayPlayers.bind(this);
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

    clickHandle() { 

        console.log("Made it to click!");

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
            $("#modalMessage").after(tempInputElm);
            $("#modalMessage").remove();
            $("#submitPlayers").text("ENTER");
            $(".num-of-players").remove();

        } else {

            let singlePlayerName = $("#playerName").val();
            
            if (singlePlayerName === ""){

                $("#playerName")
                    .attr({"placeholder": "Please Enter A Name!"})
                    .css("background-color", "red");

            } else {

                this.collectPlayerNames(singlePlayerName);
                console.log("Player Name is ", singlePlayerName);
                this.playerNumberIndex--;
                $("#playerName").val("");
                $("#playerName")
                    .attr({"placeholder": "Enter The Next Player Name!"})
                    .css("background-color", "white");

                if (this.playerNumberIndex === 0){

                    console.log("Ended Name Requests");
                    this.hideModal();
                    this.displayPlayers();
                    this.createPlayersArray();
                }
            }
        }
    }


    collectPlayerNames(nameToEnter) { 
        this.playerNameArray.push(nameToEnter);
        console.log("PlayerArray ", this.playerNameArray);
    }

    displayPlayers(){ 

        let temp = null;
        this.playerNumberIndex = this.playerNumber;

        while (this.playerNumberIndex > 0){

            temp = new Player;
            this.playerColorContainer = temp.createNewPlayerList(this.playerNumber, this.playerNameArray[this.playerNumberIndex-1]);
            this.playerNumberIndex--;
        }
        temp.setPlayerList();
    }
    createPlayersArray(){

        for (var playerIndex = 0; playerIndex < this.playerNumber; playerIndex++){

            let findPlayer = playerIndex + 1;
            let tempPlayer = $(".player" + findPlayer);
            this.domElmPlayersList.push(tempPlayer); 
            }

        game.play(this.domElmPlayersList, this.playerNameArray);
    }
}
