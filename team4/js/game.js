class Game{
    constructor(){
        this.players = [];
        this.communityChestCards = Card.initCards(COMMUNITY_CHEST_DATA);
        this.chanceCards = Card.initCards(CHANCE_DATA);
        this.currentPlayerIndex = 0;
        this.squares = Square.initSquareData();

        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
    }

    play() {
        // let model = new Modal($("#modalShadow"), $(".modalBody"), $(".submitPlayers"));
        // model.init();
     //    model.show(); 

        let go = this.squares[0];
        let player1 = new Player(go, 'icon1', 'Player1', this.handlePlayerTurnEnd);
        let player2 = new Player(go, 'icon2', 'Player2', this.handlePlayerTurnEnd);

        // TODO: attach players created in this section. 
        this.players = [player1, player2];

        
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

        console.log("Made it Init");
        this.submitPlayers.click(this.clickHandle);
        $("input").val(2);
        this.show();
    }

    clickHandle() { // Fix clickhandle

        this.playerNumber = $("input").val();

        console.log("TEST INPUT ", this.playerNumber);

        this.hideModal();
        $(this.submitPlayers).off("click");
        this.displayPlayers();
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
}
