var blipInt;

$$.onload(function () {
  var blip = true;

  $$.vars.welcome = 'your mother doesn\'t love you.';

  if (!blipInt) {
    blipInt = setInterval(function () {
      $$.vars.welcome = blip ? 'boom, bitches' : 'your mother doesn\'t love you.';
      blip = !blip;
    }, 2000);
  }
});
