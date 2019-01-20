$(document).ready(initApp);
let game = null;
let modal = null;

function initApp(){
   game = new Game();
   modal = new Modal($("#modalShadow"), $("#modalBody"), $("#submitPlayers"));
   modal.init();
   
}


