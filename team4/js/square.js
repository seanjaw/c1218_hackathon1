class Square {
    constructor( type, title, price ) {
        this.type = type;
        this.title = title;
        this.price = price;

        this.next = null;
        this.squareDom= this.createSquareDOM();
    }

    static initSquareData (){
        //set up linked list
        let squares = [];
        let neighbor = null;
        let lines = SQUARE_DATA.split('\n');
        for ( let lineIndex= lines.length - 1; lineIndex >= 0; lineIndex--){
            let line = lines[lineIndex];
            let props = line.split('\t');
            let square = new Square(...props);
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

        let textDiv = $('<div>', {'class':'text'}).text(this.title);
        let imageDiv = $('<div>', {'class':'image'});
        let text2Div = $('<div>', {'class':'text'});
        let squareDiv = $('<div>', {'class': "propInfo square"})
            .append([textDiv, imageDiv, text2Div]);
        let prop1Div = $('<div>' , {'class' : "prop1"})
            .append(squareDiv);
        return prop1Div;
    }

}