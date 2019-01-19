$(document).ready(initApp);
let game = null;
let modal = null;

function initApp(){
   modal = new Modal($("#modalShadow"), $("#modalBody"), $("#submitPlayers"));
   modal.init();
   game = new Game();
}


