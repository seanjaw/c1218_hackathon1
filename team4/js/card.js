class Card{
    /**
     * Represents a Community Chest or Chance card.
     * @constructor
     * @param {string} type - 'receive-bank'|'receive-players'|'pay-bank'
     * @param {string} amount - Money amount affected by card if applicable.
     * @param {string} text - Text to display on card 
     */
    constructor( type, amount, text ) {
        this.type = type;
        this.amount = amount;
        this.text = text;
    }

    /**
     * Parse
     * @return {Array:Card}
     */
    static initCards( rawData ) {
        let cards = [];
        let lines = rawData.split('\n');
        for ( let lineIndex= lines.length - 1; lineIndex >= 0; lineIndex--){
            let line = lines[lineIndex];
            let props = line.split('\t');
            // Convert any associated dollar amount to numeric
            if (props[1]) {
                props[1] = Number(props[1]);
            }

            cards.push(new Card(...props));
        }

        return cards;
    }
}