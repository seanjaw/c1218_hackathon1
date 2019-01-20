class Card{
    /**
     * Represents a Community Chest or Chance card.
     * @constructor
     * @param {string} type - 'receive-bank'|'receive-players'|'pay-bank'
     * @param {string} amount - Money amount affected by card if applicable.
     * @param {string} text - Text to display on card 
     */
    constructor( type, amount, text, deckName ) {
        this.type = type;
        this.amount = amount;
        this.text = text;
        this.deckName= deckName;
        this.cardDOM = this.createCardDOM();
    }

    /**
     * Parse
     * @return {Array:Card}
     */
    static initCards( deckName, rawData ) {
        let cards = [];
        let lines = rawData.split('\n');
        for ( let lineIndex= lines.length - 1; lineIndex >= 0; lineIndex--){
            let line = lines[lineIndex];
            let props = line.split('\t');
            // Convert any associated dollar amount to numeric
            if (props[1]) {
                props[1] = Number(props[1]);
            }
            props.push(deckName);
            cards.push(new Card(...props));
        }

        return cards;
    }

    createCardDOM(){
        let informationP = $('<p>').text(this.text);
        let leftDiv = $('<div>', {'class':'left'}).append(informationP);
        let imageImg  = $('<img>' ,  {src: 'images/cat-chance-chest-logo.png','class': 'imgChestSizing'});
        let rightDiv  = $('<div>',{'class':'right'}).append(imageImg);
        let bottomContainerDiv = $('<div>' , {'class':'bottomContainer'})
            .append([leftDiv, rightDiv]);
        let titleH2 = $('<h2>').text(this.deckName);
        let topContainerDiv  = $('<div>', {'class':'topContainer textAlign'})
            .append(titleH2);
        let chestBorderDiv = $('<div>', {'class':'chestBorder'})
            .append([topContainerDiv,bottomContainerDiv]);
        let chestDiv =     $('<div>', {'class':'chest'})
            .append(chestBorderDiv);
        return chestDiv;
    }
}