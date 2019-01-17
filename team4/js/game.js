class Game{
    constructor(){
        this.players = [];
        this.currentPlayerIndex = 0;
        this.squares = Square.initSquareData();
        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
        this.domElmPlayersList = [];
    }

    play(addPlayers) {
        this.domElmPlayersList = addPlayers;
        let go = this.squares[0];
        for (var playerIndex = 0; playerIndex < this.domElmPlayersList.length; playerIndex++){
            let tempName = "player"+(playerIndex + 1);
            let iconName = "icon"+(playerIndex + 1);
            let newPlayer =  new Player(go, iconName, tempName, this.handlePlayerTurnEnd, this.domElmPlayersList[playerIndex]);
            this.players.push(newPlayer);
        }
        // this.players[0].rolldice(); 
    }

    handlePlayerTurnEnd() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
        }
        this.players[this.currentPlayerIndex].rolldice();
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
