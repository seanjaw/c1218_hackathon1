class Game{
    constructor(){
        this.players = [];
        let squares = Square.initSquareData();
        let go = squares[0];
        let player1 = new Player(go);
        this.players.push(player1);
        for (let i = 0; i < 8; i++) {
            let rolls = player1.rolldice();
            let total = rolls[0] + rolls[1];
            player1.move(total);
        }
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
