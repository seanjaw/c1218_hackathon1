const PROPERTY_TYPES = ['street','railroad','utility'];

class Square {
    constructor( type, title, price, rentCosts, color, image) {

        this.type = type;
        this.title = title;
        this.price = price;
        this.rentCosts = rentCosts;
        this.image = image || null;  

        this.color = color || null;
        this.owner = null;
        this.next = null;


        this.house = 0;
        this.squareDom = null;
    }


    static initSquareData (){
        //set up linked list
        let squares = [];
        let neighbor = null;
        let lines = SQUARE_DATA.split('\n');
        for ( let lineIndex= lines.length - 1; lineIndex >= 0; lineIndex--){
            let line = lines[lineIndex];
            let props = line.split('\t');
            // Split rents apart
            props[3] = props[3].split(';');
            for(var rentIndex = 0; rentIndex < props[3].length; rentIndex++){
                props[3][rentIndex] = parseInt(props[3][rentIndex]);
            }
            props[2] = parseInt(props[2]);
            let square = new Square(...props);
            square.squareDom = $('.square-' + lineIndex);
            
            square.next = neighbor;
            
            squares.unshift(square);
            neighbor= square; 
        }
        squares[squares.length-1].next = squares[0];
        
        //add to DOM
        let sides = ['.bottomPropContainer', '.sidePropContainer', '.propContainer', '.rightPropContainer'];

        let squareIndex = 1;
        for (let sideIndex =0 ; sideIndex< sides.length ; sideIndex++ ){
            let side = sides[sideIndex];
            $(side).empty();
            for (let i = 0; i < 9; i++, squareIndex++) {
                let square = squares[squareIndex];
                $(side).append(square.squareDom);
            }
            squareIndex++;
        }

        //add corners
        $('.goStart').replaceWith(squares[0].squareDom);
        $('.jail.square').parent().parent().replaceWith(squares[10].squareDom);
        $('.freeParking').replaceWith(squares[20].squareDom);
        $('.goToJail').replaceWith(squares[30].squareDom);

        return squares;
    }
   
    static createDeed(square){
    //     let html=` <div class="deed">
    //     <div class="title">
    //         <h4>Title Deed</h4>
    //         <h2>Tennessee Avenue</h2>
    //     </div>
    //     <div class="content">
    //         <div class="left">
    //             <p>Rent</p>
    //             <p>Rent with set</p>
    //             <p>Rent with 1</p>
    //             <p>Rent with 2</p>
    //             <p>Rent with 3</p>
    //             <p>Rent with 4</p>
    //             <p>Rent with H</p>

    //         </div>
    //         <div class="right">
    //             <p>$14</p>
    //             <p>$28</p>
    //             <p>$70</p>
    //             <p>$14</p>
    //             <p>$28</p>
    //             <p>$70</p>
    //             <p>$70</p>

    //         </div>
    //     </div>
    // </div>`;
    // return $(html);
  
    let rentInfoP = $('<p>').text('Rent');
    let leftDiv = $('<div>', {'class':'left'})
    .append(rentInfoP);
    let priceInfoP = $('<p>').text('$14');
    let rightDiv = $('<div>', {'class':'right'})
    .append(priceInfoP);
    let contentDiv = $('<div>', {'class':'content'})
        .append([leftDiv, rightDiv]);
    let titleDeedH4 = $('<h4>').text('Title Deed');
    let streetH2 = $('<h2>').text('Tennesee Avenue');
    let titleDiv = $('<div>', {'class':'title'})
        .append([titleDeedH4,streetH2]);
    let deedDiv = $('<div>', {'class':'deed'})
    .append([titleDiv, contentDiv]);
    return deedDiv;



}

    createGoDOM(){
    
        let html =`<div class="goStart square">
            <div class="startArea">
                <p class="startCollect">COLLECT $200 SALARY AS YOU PASS</p>
                <P class="startGo">GO</P>
            </div>
            <div class="arrowImage">
                <img src="images/Arrow-Free-Download-PNG.png">
            </div>
        </div>`;
        return $(html);
        // let arrowImageDiv = $('<div>', {'class':'arrowImage'});
        // let startCollectP = $('<p>', {'class':'startCollect'});
        // let startGoP = $('<p>', {'class':'startGo'});
        // let startAreaDiv = $('<div>', {'class':'startArea'})
        //     .append([startCollectP,startGoP]);
        // let goStartSquareDiv = $('<div>', {'class': "goStart square"})
        //     .append([startAreaDiv,arrowImageDiv]);
        // return goStartSquareDiv;


    }

    createJailDOM(){
        let html = `<div class="jail">
            <div class="jailImageContainer">
                <div class="jail square"></div>
            </div>
            <div class="justLeft"></div>
            <div class="vistingBottom"></div>
        </div>`;
        return $(html);

        // let jailSquareDiv = $('<div>', {'class':'jail square'}).text(this.title);
        // let justLeftDiv = $('<div>', {'class':'justLeft'});
        // let visitingBottomDiv = $('<div>', {'class':'visitingBottom'});
        // let jailImageContainerDiv = $('<div>', {'class': "jailImageContainer"})
        //     .append([jailSquareDiv, justLeftDiv, visitingBottomDiv]);
        // let jailDiv = $('<div>', {'class': "jail"})
        //     .append([jailImageContainerDiv]);
        // return jailDiv;
    }

    createParkingDOM(){
        // let html = ` <div class="freeParking">
        //     <div class="parking"></div>
        //     <div class="image square"></div>
        //     <div class="free"></div>
        // </div>`;
        // return $(html);
        let parkingDiv = $('<div>', {'class':'parking'}).text(this.title);
        let imageSquareDiv = $('<div>', {'class':'image square'});
        let freeDiv = $('<div>', {'class':'free'});
        let freeParkingDiv = $('<div>', {'class': "freeParking"})
            .append([parkingDiv, imageSquareDiv, freeDiv]);
        return freeParkingDiv;
    }

    createGoToJailDOM(){
        // let html = ` <div class="goToJail square">
        //     <div class="jail"></div>
        //     <div class="image square"></div>
        //     <div class="goTo"></div>
        // // </div>`;
        // return $(html);
        let goToDiv = $('<div>', {'class':'goTo'});
        let imageDiv = $('<div>', {'class':'image square'});
        let goTo2Div = $('<div>', {'class':'goTo'});
        let goToJailDiv = $('<div>', {'class': "goToJail square"})
            .append([goToDiv, imageDiv , goTo2Div]);
        return goToJailDiv;

    }
    createSquareDOM(){
        if (this.type === 'go') return this.createGoDOM();
        if (this.type === 'jail') return this.createJailDOM();
        if (this.type === 'go-to-jail') return this.createGoToJailDOM();
        if (this.type === 'parking') return this.createParkingDOM();

    //     <div class="prop1">
    //     <div class="propInfo square topPropInfo">
    //         <div class="text topText">
    //             <p>Sad Jupiter</p>
    //         </div>
    //         <div class="image">
    //             <img src="images/sailor%20moon%20pic19.png" alt="happy venus" class="topImg">
    //         </div>
    //         <div class="text topMoney">
    //             <p>$220</p>
    //         </div>
    //     </div>
    //     <div class="propcolor red"></div>
    // </div>
        // let textDiv = $('<div>', {'class':'text'}).text(this.title);
        
        let titleDiv = $('<p>').text(this.title);
        let titleContainerDiv = $('<div>', {'class':'text'}).append(titleDiv);

        let imageDiv = null;
        if (this.image === null){
            imageDiv =$('<img>' , {'class': 'topImg'});
        }
        else{
            imageDiv =$('<img>' ,  {src: 'images/' + this.image, 'class': 'topImg'});
        }
        let imageContainerDiv = $('<div>', {'class':'image'}).append(imageDiv);
        let priceDiv = $('<p>').text(this.price);
        let priceContainerDiv = $('<div>', {'class':'text'}).append(priceDiv);
        let squareDiv = $('<div>', {'class': "propInfo square"})
            .append([titleContainerDiv, imageContainerDiv, priceContainerDiv]);
        
        let colorDiv = null;
        if (this.color === null){
            colorDiv = $('<div>' , {'class' : "propcolor"});
        }
        else{
            colorDiv = $('<div>' , {'class' : "propcolor color"});
        }
        let prop1Div = $('<div>' , {'class' : "prop1"})
            .append(squareDiv, colorDiv);   
        return prop1Div;
    }

}