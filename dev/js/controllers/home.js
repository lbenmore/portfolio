core.controllers.Home = () => {
	const 
	NUM_STARS = innerWidth * innerHeight / 2500,
	NUM_STARFIELDS = 6,
	
	initHomeFns = () => {
		new Warp($$('.container__content'));
	};
	
	class Star {
		constructor (target, i) {
	  	this.target = target;
	    this.index = i;
	    this.element = document.createElement('div');
	    
	    this.generate();
	  }
	  
	  generate () {
	  this.element.classList.add('star');
	    
	    Object.assign(this.element.style, {
	    	top: `${Math.floor(Math.random() * innerHeight)}px`,
	   	 	left: `${Math.floor(Math.random() * innerWidth)}px`
	    });
	    
	    this.target.appendChild(this.element);
	  }
	}
	
	class Starfield {
		constructor (target, warp, index) {
		  this.target = target;
	    this.index = index;
	    this.wrapper = document.createElement('div');
	    this.element = document.createElement('div');
	    
	    this.generate();
	  }
	  
	  populate () {
	  	for (let i = NUM_STARS - 1; i >= 0; i--) {
	    	new Star(this.element, i);
	    }
	  }
	  
	  generate () {
	  	this.wrapper.classList.add('starfield');
	    
	    Object.assign(this.wrapper.style, {
	    	animationDelay: `${this.index * (60 / NUM_STARFIELDS) * -1}s`
	    });
	    Object.assign(this.element.style, {
	    	width: '100%',
	      height: '100%'
	    });
	    
	    this.wrapper.appendChild(this.element);
	    this.target.appendChild(this.wrapper);
	    
	    this.populate();
	  }
	}
	
	class Warp {
		constructor (target) {
	  	this.target = target;
	    this.starfields = [];
	    
	    for (let i = NUM_STARFIELDS - 1; i >= 0; i--) {
	      this.starfields.push(new Starfield(this.target, this, i));
	    }
	    
	    this.target.addEventListener('mousemove', this.handleMouseEvent.bind(this));
	    this.target.addEventListener('mouseout', this.handleMouseEvent.bind(this));
	  }
	  
	  handleMouseEvent (e) {
	  	switch (e.type) {
	    	case 'mousemove':
	        const 
	        mouseX = e.clientX,
	        mouseY = e.clientY,
	        midPointX = innerWidth / 2,
	        midPointY = innerHeight / 2,
	        offsetX = (midPointX - mouseX) / 20,
	        offsetY = (midPointY - mouseY) / 20;
	        
	        for (let starfield of this.starfields) {
	          starfield.element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
	        }
		      
	     	break;
	       
				case 'mouseout':
					e.target.style.transform = 'translate(0px, 0px)';
				break;
			}
	  }
	}

  if ($$.loaded) {
    initHomeFns();
  } else {
    addEventListener('LOAD_EVENT', initHomeFns);
  }   
};
