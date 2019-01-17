$(document).ready(initApp);
let game = null;

function initApp(){
   
   let model = new Modal($("#modalShadow"), $("#modalBody"), $("#submitPlayers"));
   model.init();

   game = new Game();
   game.play();
}


