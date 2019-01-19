class House {
    constructor(color, square){
        this.color = color;
        this.square = square;
        this.houseUrl = {
            red: "../houseIcon/redHouse.jpg",
            green: "../houseIcon/greenHouse.png",
            blue: "../houseIcon/monopoly_house_blue.png",
            yellow: "../houseIcon/yellowHouse.png"
        };
    }
    createHouseImage(){
        var imageToAppend = $('<div>').css({
            'background-image': `url(${this.houseUrl[this.color]})`,
            'background-size': 'contain',
            'background-repeat': 'no-repeat',
            'width': '10px',
            'height': '10px',
        });
        this.appendHouseImage(imageToAppend);
    }
    appendHouseImage(image){

        this.square.squareDom.append(image);
    }
}