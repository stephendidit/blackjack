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