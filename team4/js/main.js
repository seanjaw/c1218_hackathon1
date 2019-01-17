$(document).ready(initApp);
let game = null;
let model = null;

function initApp(){
   
   model = new Modal($("#modalShadow"), $("#modalBody"), $("#submitPlayers"));
   model.init();
   game = new Game();
}


