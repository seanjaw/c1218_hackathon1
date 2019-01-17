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
        let player1 = new Player(go, 'icon1', 'Player1', this.handlePlayerTurnEnd);
        let player2 = new Player(go, 'icon2', 'Player2', this.handlePlayerTurnEnd);

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
        this.show();
    }
    
    // class SomeClass extends React.Component {
    //     handleInputChange = (val) => {
    //       console.log('selectionMade: ', val);
    //     }
    //   }

    clickHandle() { // Fix clickhandle

        this.playerNumber = $("input").val();
        this.hideModal();
        $(this.submitPlayers).off("click");
        this.displayPlayers();
    }

    displayPlayers(){ 
        let temp = new Player;
        while (this.playerNumber > 0){
            temp.createNewPlayer();
            this.playerNumber--;
        }
        temp.setPlayerList();
    }
}
