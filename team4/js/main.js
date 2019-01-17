$(document).ready(initApp);
let game = null;

function initApp(){
   game = new Game(); 

   let model = new Modal($("#modalShadow"), $("#modalBody"), $("#submitPlayers"));
   model.init();
}



