class House {
    constructor(color, square){
        this.color = color;
        this.square = square;
        this.houseUrl = {
            red: "url('../houseIcon/redHouse.jpg')",
            green: "url('../houseIcon/greenHouse.png')",
            blue: "url('../houseIcon/monopoly_house_blue.png')",
            yellow: "url('../houseIcon/yellowHouse.png')"
        };
    }
    createHouseImage(){
        var imageToAppend = $('<div>').css({
            'background-image': this.houseUrl[this.color],
            'background-size': contain,
            'background-repeat': 'no-repeat',
            'width': '10px',
            'height': '10px',
        });
        this.appendHouseImage(imageToAppende);
    }
    appendHouseImage(image){

        this.square.squareDom.append(image);
    }
}