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
     */
    showFrame( title, content, buttons ) {
        let dialog = $('.action-dialog-container');
        dialog.find('.avatar .image').css({
            'background-image': this.currentPlayer.avatarSmall
        });
        dialog.find('.avatar .name').text(this.currentPlayer.name);

        let buttonsSection = dialog.find('.buttons');
        buttonsSection.empty();
        for (let buttonName in buttons) {
            let callback = buttons[buttonName];
            let button = $('<button>')
                .text(buttonName)
                .click(callback);
            buttonsSection.append(button);
        }

        dialog.find('.action > .content').empty().append(content);
        dialog.find('.action > .title').text(title);
        dialog.css({display: 'block'});
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
        this.showFrame(title, content, buttons);
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
                this.currentPlayer.removeMoney(card.amount);
                this.showInteractiveFrame();
            };
        } else if (card.type === 'receive-bank') {
            okCallback = () => {
                this.currentPlayer.addMoney(card.amount);
                this.showInteractiveFrame();
            };            
        } else if (card.type === 'receive-players') {
            okCallback = () => {
                this.currentPlayer.receiveMoneyFromPlayers(card.amount);
                this.showInteractiveFrame();
            }; 
        }

        this.showFrame( title, content, {'OK': okCallback} );
    }

    /**
     * Show frame that indicates location player moved to if there is no action involved
     */
    showLocationFrame() {
        let square = this.currentPlayer.square;
        let title =  `Landed on '${square.title}'`;
        this.showFrame(title, null, {'OK': this.showInteractiveFrame});
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
