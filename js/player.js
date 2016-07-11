function Player(purse=999){
  // this.hand = [];
  this.purse = purse;
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
      game.showButtons("newgame");


    } else if (handCurrentlyBeingPlayed.totalValue == 21){
      handCurrentlyBeingPlayed.played = true;
      console.log("This is the best score you can get with this hand--so...moving on!")
      game.disableAllButtons();
      renderHands();
    }
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

      this.setCurrentHandValue(handCurrentlyBeingPlayed);

      this.isABlackjack(handCurrentlyBeingPlayed);
      
      this.setPlayActionButtons(checkIfHandFirstMove(handCurrentlyBeingPlayed));

    } else { 
      console.log("NO HANDS LEFT TO PLAY!")
    }
    
    $('#hit').click(function(){

      player.hit(thisHandNumber,handCurrentlyBeingPlayed)

      handCurrentlyBeingPlayed.totalValue = totalHand(handCurrentlyBeingPlayed.hand);

      player.play();

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