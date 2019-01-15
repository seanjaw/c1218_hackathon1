# c1218_hackathon1

## Topic - monopoly

### requirements
- must have a customized theme
- properties as per monopoly <a href="https://en.wikipedia.org/wiki/Monopoly_(game)" target="_blank">rules and specs</a>
- must have a README.md file with
  - link to figma wireframe
  - link to spreadsheet with features for board and order rankings
  - link to trello board with feature sets
  - gh-pages link
  - all requirements met by 6pm Thursday, January 17th
- multiple players ( 2 to 4 )
  - each has name
  - each has game piece
  - each has a color
- monopoly game board
  - properties can be landed on
  - properties can be bought by players that land on them
- game pieces
  - properties
    - properties cost money from player
    - properties show up in player's list
    - properties show up as owned by a particular player
    - properties can have houses added to them (max 4)
    - properties can have hotels added to them (max 4, first can only be placed when 4 houses exist.  All houses are removed with first hotel)
    - non-standard properties
      - railroads
      - utilities
      - cannot have houses / hotels put on them
      - having more than one increases rent
    - properties charge rent to players
      - 0 rent if you own the property
      - a given amount (plus bonus if houses/hotels are on it)
    - 4 special properties:
      - go (collect 200 dollars as you pass
      - jail
        - just visiting (free parking)
        - in jail 
          - must roll doubles to get out
          - 3 turns get out automaticallly
      - free parking ( no cost to stay there )
      - go to jail (go immediately to jail "in jail"
  - game pieces
    - each player can pick a unique player piece
    - player pieces can go around the board
    - can just be icons
  - cards
    - two types (community chest and chance)
    - have text on them
    - has a game effect that players can gain
      - gain / lose money from bank / players
      - move to properties
      - go again, etc
      - get out of jail (keep)
      - go to jail
      - use the cards as your basis
  - dice
    - two dice
    - six sides each
    - rolled together
    - doesn't have to physically look like rolling dice
    - yields numbers from 2 to 12
    - rolling double allows you to go again after this turn
    - three times in a row puts you in jail

### teams

- team1
  - Edgar Padilla
  - Alejandro Carrillo
  - Christopher Sulayao
  - Anthony Boccino
- team 2
  - Joshua Garcia
  - Bill Darnall
  - Charu Benjawal
  - Christine Than
- team 3
  - John Holman
  - Danika Quinteros
  - Diana Curtis
  - Hannel Gwak
- team 4
  - Matthew Staniszewski
  - Sean Jaw
  - Karen King
  - Xiaoyun(Stella) Hsin
  
### example milestones 

#### 0.1
- basic html + css
- basic player layout
- 1 player able to roll dice and move
- basic money on player
- players can choose name
#### 0.5
- basic ability to buy property and add to player
- basic ability to see deeds to property
- can be charged rent for landing on property owned by other player
- passing go (or the first property) rewards money
#### 0.75
- special property ability functionality (railroad multiplier, waterworks + electric company multiplier)
- special squares start to work (luxury tax, etc)
- rent varies depending on property count
- CSS polish pass 1
#### 1.0
- corner square functionality
- community chest and chance functionality
  - get cards when landing on square
  - only cards that are used immediately
- can lose game when reduced to 0 money
- CSS polish pass 2
- players can choose icons rather than being assigned
#### 1.50
- build houses
- build hotels
- rent varies based on houses/hotels
- ability to sell houses/hotels
#### 2.0
- community chest and chance functionality with cards that can be kept (eg: get out of jail free)
- mortgage properties
- unmortgage properties

