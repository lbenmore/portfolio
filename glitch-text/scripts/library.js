// JavaScript Document

class Glitch {
  constructor (options) {
    const 
      arrAlphaNumerics = ['q','w','e','r','t','y','u','i','o','p','a','s','d','f','g','h','j','k','l','z','x','c','v','b','n','m','Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','Z','X','C','V','B','N','M'];
    
    this.color1 = options.color1 || '#f00';
    this.color2 = options.color2 || '#00f';
    this.container = options.container || 'body';
    this.glitches = options.text || 'random';
    
    if (this.glitches == 'random') {
      this.glitches = [];
      for (let i = 0; i < 10; i++) {
        let newChar = arrAlphaNumerics[Math.floor(Math.random() * arrAlphaNumerics.length)];
        
        while (this.glitches.indexOf(newChar) > -1) {
          newChar = arrAlphaNumerics[Math.floor(Math.random() * arrAlphaNumerics.length)];
        }
        
        this.glitches.push(newChar);
      }
    } else if (typeof glitch == 'string') {
      let text = this.glitch;
      this.glitches = [];
      this.glitches.push(text);
    }
    
    document.body.style.setProperty('--color1', this.color1);
    document.body.style.setProperty('--color2', this.color2);
    
    this.wrapGlitches();
  }
  
  wrapGlitches () {
    let allNodes = document.querySelectorAll(this.container + ' *');
    
    for (let node of allNodes) {
      let text = node.textContent,
      tag = node.tagName.toLowerCase(),
      newText = [];
      
      newText.push('<' + tag + '>');
      
      for (let i = 0; i < text.length; i++) {
        if (this.glitches.indexOf(text[i]) > -1) {
          newText.push('<span class="glitch" data-glitch-text="' + text[i] + '">' + text[i] + '</span>');
        } else {
          newText.push(text[i]);
        }
      }
      
      newText.push('</' + tag + '>');
      node.innerHTML = newText.join('');
    }
  }
}

new Glitch({
  "text": "random",
  "container": "#container",
  "color1": "#80f",
  "color2": "#0f8"
});
