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

function renderDealer(){
  $('#dealer').empty();
}