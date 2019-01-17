class Game{
    constructor(){
        this.players = [];
        this.currentPlayerIndex = 0;
        this.squares = Square.initSquareData();

        this.handlePlayerTurnEnd = this.handlePlayerTurnEnd.bind(this);
    }

    play() {
        // let model = new Modal($("#modalShadow"), $(".modalBody"), $(".submitPlayers"));
        // model.init();
     //    model.show(); 

        let go = this.squares[0];
        let player1 = new Player(go, 'icon1', this.handlePlayerTurnEnd);
        let player2 = new Player(go, 'icon2', this.handlePlayerTurnEnd);

        this.players = [player1, player2];
        
        this.players[0].rolldice();
    }

    handlePlayerTurnEnd() {
        this.currentPlayerIndex++;
        if (this.currentPlayerIndex >= this.players.length) {
            this.currentPlayerIndex = 0;
        }
        this.players[this.currentPlayerIndex].rolldice();
    }
}

class Modal{

	constructor(modalShadow, modalBody, submitPlayers){

		this.modalShadow = modalShadow;
		this.modalBody = modalBody;
        this.playerNumber = 0;
        this.submitPlayers = submitPlayers;
        this.submitPlayers = this.submitPlayers.bind(this);
    }
  
	show(){

		$(this.modalShadow).show();
        $(this.modalBody).show();
    }
    
	hide(){

        console.log("Clicked hide");
		$(this.modalShadow).hide();
        $(this.modalBody).hide();
	}
	
	init(){

        console.log("Made it Init");
        this.submitPlayers.click(this.clickHandle);
        this.show();
    }
    
    clickHandle(event){ // Fix clickhandle


        this.playerNumber = $(".numberOfPeopleInput").text();

        this.hide();
		$(this.modalMessage).off("click");
        $(this.modalMessage).click(this.hide);
        return event;
    }

    displayPlayers(){ 
        console.log("Can dipslay players");
        // while (this.playerNumber > 0){

        // }
    }
}
