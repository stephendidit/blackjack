function Shoe(){
  this.cards = [];
  this.initialCardCount;
  this.currentCardCount;
  this.SHOE_RESHUFFLE_MARKER = .75;

  this.setInitialCardCount = function(){
    this.initialCardCount = howManyDecks * 52;
  }


  this.setCurrentCardCount = function(){
    this.currentCardCount = this.cards.length;
  }

  this.build = function(requestedNumberOfDecks){
    var VALUES_ARRAY_FACE_OFFSET = 0;
    var VALUES_ARRAY_FACE_VALUE_OFFSET = 1;
    var numberOfDecksBuilt = 0;
    var CARDS_ARRAY_OFFSET = 0;
    var CARD_SUIT_CARD_VALUE_OFFSET = 0;
    var CARD_VALUE_ONLY_OFFSET = 1;

    while (numberOfDecksBuilt < requestedNumberOfDecks){          
      suitsArray.forEach(function (suit){ // for each symbol
        valuesArray.forEach(function(value){ // for each value
          
          shoe.cards[CARDS_ARRAY_OFFSET] = []; // make an element that's also an array for the new card, in the position of the current index
          shoe.cards[CARDS_ARRAY_OFFSET][CARD_SUIT_CARD_VALUE_OFFSET] = suit + value[VALUES_ARRAY_FACE_OFFSET]; // the new element/array's first element = symbol + value[0]
          shoe.cards[CARDS_ARRAY_OFFSET][CARD_VALUE_ONLY_OFFSET] = value[VALUES_ARRAY_FACE_VALUE_OFFSET]; // the new element/array's second element = value[1]
          CARDS_ARRAY_OFFSET++; // increase the index
        });
      });
      numberOfDecksBuilt++;
    }

    this.setInitialCardCount();
    // this.setCurrentCardCount();
  }; // end build

  this.shuffle = function(){ // https://github.com/coolaj86/knuth-shuffle , http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  
    var currentIndex = this.cards.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    } // end while
  }; // end shuffle

  this.getNewCardFrom = function(){
    this.shuffle();
    return this.cards.pop();
  };
}