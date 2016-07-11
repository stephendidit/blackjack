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