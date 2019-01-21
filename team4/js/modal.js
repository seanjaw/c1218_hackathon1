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
        
        ("this event was ",event);
        ("Made it to click!");
        
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

        ("Event is ",event);
        ("Made it to Icon!");
        this.playerIconArray.push(imagesrc);
        ("icon was ", imagesrc);
        let iconToRemove = this.iconArray.indexOf(imagesrc);
        this.iconArray.splice(iconToRemove, 1);
        $(this.tempIconContainerElm).css("display", "none");
        $(".icon").remove();
        if (this.playerNumberIndex === 0){

            ("Ended Name Requests");
            this.hideModal();
            this.displayPlayers();
            this.createPlayersArray();
        }
    }

    collectPlayerNames(nameToEnter) { 

        this.playerNameArray.push(nameToEnter);
        ("PlayerArray ", this.playerNameArray);
        $(".playersBox").css("display", "block");
    }

    displayPlayers(){ 

        let temp = null;
        this.playerNumberIndex = this.playerNumber;

        for (var displayIndex = 0; displayIndex < this.playerNameArray.length; displayIndex++){
            let className = "player" + (displayIndex+1);
            temp = new Player;
            this.playerColorContainer = temp.createNewPlayerList(this.playerNumber, this.playerNameArray[displayIndex], className);
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
