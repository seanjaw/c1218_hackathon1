class Game{
    constructor(){
        this.players = [];
        let squares = Square.initSquareData();
        let go = squares[0];
        let player1 = new Player(go);
        this.players.push(player1);
        for (let i = 0; i < 1; i++) {
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
