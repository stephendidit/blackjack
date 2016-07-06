// GLOBAL //
var suitsArray = ['h','s','c','d'];
var valuesArray = [['a',1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9],[10,10],['j',10],['q',10],['k',10]];

function renderHands(){
  $('#player').empty();

  for (var i = 1; i <= countNumberOfPlayerHisHands(player.hands); i++){
    var code = "<div class='hand' id='hand" + i + "'>"

    player.hands[i].hand.forEach(function(card){
      var suit = card[0].charAt(0).replace("d","&#9830;").replace("s","&#9824;").replace("h","&#9829;").replace("c","&#9827;")
      var value = card[0].substring(1);
      code += "<div class='card'>" + suit + value.toUpperCase() + "</div>";
    });

    code += "</div>"
    $('#player').append(code);
  };
}

function totalHand(hand){
  var totalValueOfHand = 0; // zero out the total
  var numberOfAcesInHand = 0; // zero out the number of aces...i think this is dealer's totaling, then.
  var CARD_VALUE_OFFSET = 1;
  
  hand.forEach(function(card){ // for each element in the dealer's hand
    if (card[CARD_VALUE_OFFSET] == 1) {
      numberOfAcesInHand += 1; // add 1 to the number of aces we're counting
    } else { // but if it's not an ace...
      totalValueOfHand += card[CARD_VALUE_OFFSET]; // then add the card to the total
    }
  });

  while (numberOfAcesInHand > 0){ // while there's more than 0 aces
    if ((totalValueOfHand + 11) > 21){ // if the total + 11 goes over 21
      totalValueOfHand +=1; // then the ace needs to be treated as a 1
    } else { // otherwise
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

// OBJECTS

function Game(){
  this.disableAllButtons = function(){
    $('button').hide();
  }
  this.showButtons = function(){
    $('button').off(); // http://stackoverflow.com/questions/14969960/jquery-click-events-firing-multiple-times
    var args = Array.prototype.slice.call(arguments);
    args.forEach(function (arg){
      $('#' + arg).show();
    });
  }
}

function Deck(){
  this.cards = [];

  this.build = function(requestedNumberOfDecks){
    var ValuesArrayFaceOffset = 0;
    var ValuesArrayFaceValueOffset = 1;
    var numberOfDecksBuilt = 0;
    var cardsArrayOffset = 0;
    var cardSuitAndCardValueOffset = 0;
    var cardValueOnlyOffset = 1;

    while (numberOfDecksBuilt < requestedNumberOfDecks){          
      suitsArray.forEach(function (suit){ // for each symbol
        valuesArray.forEach(function(value){ // for each value
          
          deck.cards[cardsArrayOffset] = []; // make an element that's also an array for the new card, in the position of the current index
          deck.cards[cardsArrayOffset][cardSuitAndCardValueOffset] = suit + value[ValuesArrayFaceOffset]; // the new element/array's first element = symbol + value[0]
          deck.cards[cardsArrayOffset][cardValueOnlyOffset] = value[ValuesArrayFaceValueOffset]; // the new element/array's second element = value[1]
          cardsArrayOffset++; // increase the index
        });
      });
      numberOfDecksBuilt++;
    }
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

function Dealer(){
  this.hand = [];

  this.draw = function(){
    this.hand.push( deck.getNewCardFrom() );

  };

  this.play = function(){
    
    this.totalValueOfDealerHand = totalHand(this.hand); // who knows what this var is?
    console.info(this.totalValueOfDealerHand); // should begin as 0, i guess....
    while (this.totalValueOfDealerHand <= 17) { // if sometotal is less than 17...sometotal should be the more like dealer.total
      dealer.draw(); // draw again
      this.totalValueOfDealerHand = totalHand(this.hand); // and re-total the hand
    }
  };
}

function Player(){
  // this.hand = [];
  this.purse = 1000;
  this.wager = 25;

  $('#wager').html("Wager: $" + this.wager);
  $('#purse').html("Purse: $" + this.purse);

  this.hands = {
    1: {
      hand: [],
      played: false
    }
  };

  this.lose = function(){
    player.purse -= player.wager;
    refreshPurse();
  }

  this.win = function(){
    player.purse += player.wager;
    refreshPurse();
  }

  this.stay = function(handCurrentlyBeingPlayed){
    handCurrentlyBeingPlayed.played = true;
    player.play();
  }

  this.draw = function(whichHandNumber){
    console.log("about to draw card for hand " + whichHandNumber)
    var handToAddNewCardTo = this.hands[whichHandNumber]['hand']
    handToAddNewCardTo.push( deck.getNewCardFrom() );
    renderHands();
  };

  this.hit = function(thisHandNumber,handCurrentlyBeingPlayed){
    player.draw(thisHandNumber); // grab a random card and add to current hand

    handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand); // recalculate value

    if (handCurrentlyBeingPlayed.totalValue > 21){
      handCurrentlyBeingPlayed.played = true;
      
      this.lose();
      
      console.log("BUST!");

      game.disableAllButtons();
      // player.play();
    } else if (handCurrentlyBeingPlayed.totalValue == 21){
      handCurrentlyBeingPlayed.played = true;
      console.log("This is the best score you can get with this hand--so...moving on!")
      game.disableAllButtons();
    }

    // handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);

    // player.play();

    // console.log(player.hands);
  }

  this.split = function(){

    // console.log("---------------->\njust began player.split")
    var totalNumberOfPlayerHands = countNumberOfPlayerHisHands(this.hands); // gets "object of objects" length

    this.hands[totalNumberOfPlayerHands + 1] = {hand:[], played: false}; // new object assigned to next integer

    totalNumberOfPlayerHands = countNumberOfPlayerHisHands(this.hands); // gets "object of objects" length

    console.log("totalNumberOfPlayerHands = " + totalNumberOfPlayerHands);
  }

  this.setPlayActionButtons = function(isHandFirstMove){
    if (isHandFirstMove === true){
      game.disableAllButtons();
      game.showButtons("double","stay","hit","split");
      isHandFirstMove = false;
    } else {
      game.showButtons("stay","hit","split");
    }
  }

  this.isABlackjack = function(handCurrentlyBeingPlayed){
    if ( (Object.keys(handCurrentlyBeingPlayed.hand).length == 2) && handCurrentlyBeingPlayed.totalValue == 21) { 
      game.disableAllButtons();
      this.purse += (this.wager * 1.5);
      refreshPurse();
      return true;
    }
  }

  this.findFirstHandAvailableToPlay = function(){
    for (var thisHandNumber in this.hands){ 
      if (!this.hands[thisHandNumber].played){
        return thisHandNumber;
      } 
    }
    return false;
  }

  this.setCurrentHandValue = function(handCurrentlyBeingPlayed){
    handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);
  }


  this.play = function(){
    if (this.findFirstHandAvailableToPlay()) {
      var handCurrentlyBeingPlayed = this.hands[this.findFirstHandAvailableToPlay()];
      var thisHandNumber = this.findFirstHandAvailableToPlay();
      console.log(">>>>>>>>\nThere's a hand to play! HAND " + thisHandNumber + "\n<<<<<<<<");

      this.setCurrentHandValue(handCurrentlyBeingPlayed);

      if ( this.isABlackjack(handCurrentlyBeingPlayed) ) {
        handCurrentlyBeingPlayed['played'] = true;
      }
      
      this.setPlayActionButtons(checkIfHandFirstMove(handCurrentlyBeingPlayed));

    } else { 
      console.log("NO HANDS LEFT TO PLAY!")
    }
    
    $('#hit').click(function(){
      console.log("about to send thisHandNumber: " + thisHandNumber);
      // console.log("as well as handCurrentlyBeingPlayed: " + handCurrentlyBeingPlayed);
      player.hit(thisHandNumber,handCurrentlyBeingPlayed)

      handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);

      player.play();
      console.log(player.hands);
    });


    $('#split').click(function(){
      player.split();
    });

    $('#stay').click(function(){
      player.stay(handCurrentlyBeingPlayed);
      // handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);
      // console.log("post-move/inside while Hand value: " + handCurrentlyBeingPlayed.totalValue);
    });

  }
}
var howManyDecks = 1;


// TESTS
var game = new Game();
var deck = new Deck();
deck.build(howManyDecks);

// var dealer = new Dealer();

var player = new Player();

// dealer.draw(); 
player.draw(1);
// dealer.draw(); // this one would be face down 
player.draw(1);

player.play();

// dealer.play(); 