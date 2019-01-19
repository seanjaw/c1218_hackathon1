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
        this.squareDom = null;
        this.deedDOM = null;
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

            // Attach DOM objects
            square.squareDom = $('.square-' + lineIndex);
            square.deedDOM = square.createDeedDOM();
            
            // Set next neighboring square
            square.next = neighbor;
            
            squares.unshift(square);
            neighbor= square; 
        }
        squares[squares.length-1].next = squares[0];
        
        //add to DOM
        // let sides = ['.bottomPropContainer', '.sidePropContainer', '.propContainer', '.rightPropContainer'];

        // let squareIndex = 1;
        // for (let sideIndex =0 ; sideIndex< sides.length ; sideIndex++ ){
        //     let side = sides[sideIndex];
        //     $(side).empty();
        //     for (let i = 0; i < 9; i++, squareIndex++) {
        //         let square = squares[squareIndex];
        //         $(side).append(square.squareDom);
        //     }
        //     squareIndex++;
        // }

        // //add corners
        // $('.goStart').replaceWith(squares[0].squareDom);
        // $('.jail.square').parent().parent().replaceWith(squares[10].squareDom);
        // $('.freeParking').replaceWith(squares[20].squareDom);
        // $('.goToJail').replaceWith(squares[30].squareDom);

        return squares;
    }
   
    /*
     * Create a Deed for this square
     */
    createDeedDOM(){
  
        // TODO: Should use color class instead, but currently CSS color classes also style layout...
        //       Also there is a dependency to the current square.color in Player code to organize properties into color sets
        const COLORS = {
            'brown': 'saddlebrown',
            'blue': '#31b0d5',
            'pink': '#df5277',
            'orange': 'darkorange',
            'red': '#cd0a0a',
            'yellow': 'gold',
            'green': '#449d44',
            'grey': '#5e5e5e'
        };

        const RENT_LABELS = [
            'Rent',
            'Rent with set',
            'Rent with 1',
            'Rent with 2',
            'Rent with 3',
            'Rent with 4',
            'Rent with hotel'
        ];

        // Rent Section
        let leftDiv = $('<div>', {'class':'left'});
        let rightDiv = $('<div>', {'class':'right'});

        for (let i = 0; i < RENT_LABELS.length; i++) {
            let rentLabelP = $('<p>').text(RENT_LABELS[i]);
            let rentCostP = $('<p>').text('$' + this.rentCosts[i]);
            leftDiv.append(rentLabelP);
            rightDiv.append(rentCostP);
        }

        let contentDiv = $('<div>', {'class':'content'})
            .append([leftDiv, rightDiv]);

        // Header Section
        let titleDeedH4 = $('<h4>').text('Title Deed');
        let streetH2 = $('<h2>').text(this.title);
        let titleDiv = $('<div>', {'class':'title'})
            .css({'background-color': COLORS[this.color]})
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