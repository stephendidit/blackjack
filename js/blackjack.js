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

    code += "<div class='count'>" + totalHand(player.hands[i].hand) + "</div></div>"
    $('#player').append(code);
  };

  for (var i = 1; i <= countNumberOfPlayerHisHands(player.hands); i++){

    if (player.hands[i].played == false){
      $('#hand' + i).addClass("active-hand");
      break;
    }
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

function Dealer(){
  this.hand = [];

  this.draw = function(){
    this.hand.push( shoe.getNewCardFrom() );

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

  this.double = function(){
    this.wager = this.wager * 2;
    $('#wager').html("Wager: $" + this.wager);
  }

  this.draw = function(whichHandNumber){
    var handToAddNewCardTo = this.hands[whichHandNumber]['hand']
    handToAddNewCardTo.push( shoe.getNewCardFrom() );

    renderHands();

    shoe.setCurrentCardCount();

    this.hands[whichHandNumber].totalValue = totalHand(handToAddNewCardTo); // total here so that on initial draws it'll know whether or not a blackjack
    this.isABlackjack(this.hands[whichHandNumber]);
  };

  this.findFirstHandAvailableToPlay = function(){
    for (var thisHandNumber in this.hands){ 
      if (!this.hands[thisHandNumber].played){
        return thisHandNumber;
      } 
    }
    return false;
  }

  this.hit = function(thisHandNumber,handCurrentlyBeingPlayed){
    player.draw(thisHandNumber); // grab a random card and add to current hand
    
    handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand); // recalculate value

    if (handCurrentlyBeingPlayed.totalValue > 21){
      handCurrentlyBeingPlayed.played = true;
      
      this.lose();
      
      console.log("BUST!");
      renderHands();

      game.disableAllButtons();
      // player.play();
    } else if (handCurrentlyBeingPlayed.totalValue == 21){
      handCurrentlyBeingPlayed.played = true;
      console.log("This is the best score you can get with this hand--so...moving on!")
      game.disableAllButtons();
      renderHands();
    }

    // handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);

    // player.play();

    // console.log(player.hands);
  }

  this.isABlackjack = function(handCurrentlyBeingPlayed){
    if ( (Object.keys(handCurrentlyBeingPlayed.hand).length == 2) && handCurrentlyBeingPlayed.totalValue == 21) { 
      
      game.disableAllButtons();
      
      this.purse += (this.wager * 1.5);
      
      refreshPurse();

      handCurrentlyBeingPlayed['played'] = true;

      return true;
    }
  }

  this.lose = function(){
    player.purse -= player.wager;
    refreshPurse();
  }

  this.play = function(){
    if (this.findFirstHandAvailableToPlay()) {
      var handCurrentlyBeingPlayed = this.hands[this.findFirstHandAvailableToPlay()];
      var thisHandNumber = this.findFirstHandAvailableToPlay();
      console.log(">>>>>>>>\nThere's a hand to play! HAND " + thisHandNumber + "\n<<<<<<<<");

      this.setCurrentHandValue(handCurrentlyBeingPlayed);

      this.isABlackjack(handCurrentlyBeingPlayed);

      // if ( this.isABlackjack(handCurrentlyBeingPlayed) ) {
        // handCurrentlyBeingPlayed['played'] = true;
      // }
      
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

    $('#double').click(function(){
      player.double();
    })

    $('#newgame').click(function(){
      newGame();
    })

    $('#split').click(function(){
      player.split();
    });

    $('#stand').click(function(){
      player.stand(handCurrentlyBeingPlayed);
      // handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);
      // console.log("post-move/inside while Hand value: " + handCurrentlyBeingPlayed.totalValue);
    });

  }

  this.setCurrentHandValue = function(handCurrentlyBeingPlayed){
    handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);
  }

  this.setPlayActionButtons = function(isHandFirstMove){
    if (isHandFirstMove === true){
      game.disableAllButtons();
      game.showButtons("double","stand","hit","split","newgame");
      isHandFirstMove = false;
    } else {
      game.showButtons("stand","hit","split");
    }
  }

  this.split = function(){

    // console.log("---------------->\njust began player.split")
    var totalNumberOfPlayerHands = countNumberOfPlayerHisHands(this.hands); // gets "object of objects" length

    this.hands[totalNumberOfPlayerHands + 1] = {hand:[], played: false}; // new object assigned to next integer

    totalNumberOfPlayerHands = countNumberOfPlayerHisHands(this.hands); // gets "object of objects" length

    player.draw(totalNumberOfPlayerHands);
    player.draw(totalNumberOfPlayerHands);

    console.log("totalNumberOfPlayerHands = " + totalNumberOfPlayerHands);
  }

  this.stand = function(handCurrentlyBeingPlayed){
    handCurrentlyBeingPlayed.played = true;
    renderHands();
    player.play();
  }

  this.win = function(){
    player.purse += player.wager;
    refreshPurse();
  }
  
}

var howManyDecks = 1;


var game = new Game();
var shoe = new Shoe();
shoe.build(howManyDecks);
var player = new Player();

newGame = function(){
  // game = undefined;
  // shoe = undefined;
  tempPurse = player.purse // holds purse value while resetting hands
  player = {
    purse: tempPurse
  }
  player = new Player();

  renderHands();
  // dealer.draw(); 
  player.draw(1);
  // dealer.draw(); // this one would be face down 
  player.draw(1);

  player.play();

  // dealer.play(); 
}

newGame();
// TESTS
// var game = new Game();
// var shoe = new Shoe();
// shoe.build(howManyDecks);

// var dealer = new Dealer();


