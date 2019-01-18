class Game{
    constructor(){
        this.players = [];
        this.communityChestCards = Card.initCards(COMMUNITY_CHEST_DATA);
        this.chanceCards = Card.initCards(CHANCE_DATA);
        this.currentPlayerIndex = 0;
        this.squares = Square.initSquareData();
        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
        this.domElmPlayersList = [];
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
    }

    play(addPlayers) {
        
        this.domElmPlayersList = addPlayers;
        console.log("Dome Elm ", this.domElmPlayersList)
        let go = this.squares[0];
console.log("Passing Array ", addPlayers);
        for (var playerIndex = 0; playerIndex < this.domElmPlayersList.length; playerIndex++){
            let tempName = "player"+(playerIndex + 1);
            let iconName = this.iconArray[playerIndex];
            let newPlayer =  new Player(go, iconName, tempName, this.handlePlayerTurnEnd, this.domElmPlayersList[playerIndex]);
            console.log("added ", this.domElmPlayersList[playerIndex])
            this.players.push(newPlayer);
            newPlayer.updateDisplay();
        }
        
        this.players[0].rolldice();
        this.displayCurrentMoney();
    }

    handlePlayerTurnEnd() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
        }
        this.players[this.currentPlayerIndex].rolldice();
        this.displayCurrentMoney();
    }
    displayCurrentMoney(){

        let currentPlayer = this.players[this.currentPlayerIndex];
            console.log("Current Player ",currentPlayer);
        let currentMoney = (currentPlayer.money).toString();
            console.log("Curent Money ", "Money " + currentMoney);
        let currentDomElmPlayer = currentPlayer.domElmPlayerInfo[game.currentPlayerIndex];
            console.log(currentDomElmPlayer);
        $(currentDomElmPlayer).text("Money $" + currentMoney); 
    }
}
class Modal {

	constructor(modalShadow, modalBody, submitPlayers){
		this.modalShadow = modalShadow;
		this.modalBody = modalBody;
        this.playerNumber = 0;
        this.submitPlayers = submitPlayers;
        this.submitPlayers = this.submitPlayers.bind(this);
        this.clickHandle = this.clickHandle.bind(this);
    }
  
	show(){

		$(this.modalShadow).show();
        $(this.modalBody).show();
        // $(this.submitPlayers).show();
    }
    
	hideModal(){

		$(this.modalShadow).hide();
        $(this.modalBody).hide();
        // $(this.submitPlayers).hide();
	}
	
	init(){

        this.submitPlayers.click(this.clickHandle);
        $("input").val(2);
        this.show();
    }

    clickHandle() { 

        this.playerNumber = $("input").val();
        this.hideModal();
        $(this.submitPlayers).off("click");
        this.displayPlayers();
        this.createPlayersArray();
    }

    displayPlayers(){ 
        let temp = null;

        while (this.playerNumber > 0){
            temp = new Player;
            temp.createNewPlayerList();
            this.playerNumber--;
        }
        temp.setPlayerList();
        
    }
    createPlayersArray(){
        let tempArray = [];
        for (var playerIndex = 0; playerIndex < $("h1").length; playerIndex++){

            let findPlayer = playerIndex + 1;
            let tempPlayer = $(".player" + findPlayer);
            tempArray.push(tempPlayer); 
            }
        game.play(tempArray);
    }
}
