// GLOBAL //
var suitsArray = ['h','s','c','d'];
var valuesArray = [['a',1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],['j',10],['q',10],['k',10]];



function totalHand(hand){
  var totalValueOfHand = 0; // zero out the total
  var numberOfAcesInHand = 0; // zero out the number of aces so we can determine their value later
  var CARD_VALUE_OFFSET = 1; // constant. this is the offset that has the value as integer
  var INITIAL_VALUE_OF_ACE = 1; // constant. all Aces have value of 1, initially.

  hand.forEach(function(card){ // for each element in the dealer's hand
    var valueOfCard = card[CARD_VALUE_OFFSET];

    // First, total the cards that are NOT aces. Any aces, just count them.
    if (valueOfCard == INITIAL_VALUE_OF_ACE) {
      numberOfAcesInHand += 1;
    } else {
      totalValueOfHand += valueOfCard;
    }
  });

  // Then, add any Aces to the hand, either with value of 1 or 11, 
  // whichever will get total as close to 21 without going over.
  while (numberOfAcesInHand > 0){ // while there's more than 0 aces
    if ((totalValueOfHand + 11) > 21){ // if the total + 11 goes over 21
      totalValueOfHand +=1; // then the ace needs to be treated as a 1
    } else {
      totalValueOfHand += 11; // treat it as an 11
    }
    numberOfAcesInHand--; // remove one ace from the count
  }

  return totalValueOfHand;
}

function countNumberOfPlayerHisHands(handsOfPlayer){
  return Object.keys(handsOfPlayer).length
}

function checkIfHandFirstMove(handCurrentlyBeingPlayed){
  if (handCurrentlyBeingPlayed.hand.length == 2){
    return true;
  } else {
    return false;
  }
}

function refreshPurse(){
  $('#purse').html("Purse: $" + player.purse);
}

function newGame(){
  previousPurseValue = player.purse // holds purse value while resetting hands
  player = new Player(previousPurseValue);
  
  player.purse = previousPurseValue;
  renderHands();
  
  dealer.draw();
  player.draw(1);
  // dealer.draw(); // this one would be face down 
  player.draw(1);

  player.play();

  // dealer.play(); 
}

// OBJECTS

var howManyDecks = 1;


var game = new Game();
var shoe = new Shoe();

shoe.build(howManyDecks);

var player = new Player();
var dealer = new Dealer();



newGame();

