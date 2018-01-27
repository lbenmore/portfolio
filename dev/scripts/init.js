// JavaScript document

var ua = navigator.userAgent.toLowerCase();

if (ua.indexOf('trident') > -1 || ua.indexOf('msie') > -1) {
  document.querySelector('#styles--stylesheet').setAttribute('href', './styles/legacy.stylesheet.css');
  document.querySelector('#scripts--bnmr').setAttribute('src', './scripts/legacy.bnmr.js');
  document.querySelector('#scripts--library').setAttribute('src', './scripts/legacy.library.js');
} else {
  document.querySelector('#styles--stylesheet').setAttribute('href', './styles/stylesheet.css');
  document.querySelector('#scripts--bnmr').setAttribute('src', './scripts/bnmr.js');
  document.querySelector('#scripts--library').setAttribute('src', './scripts/library.js');
}
