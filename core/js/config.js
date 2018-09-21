var config = {};

config.pages = {
  "home": {
    "html": "./html/pages/home.html",
    "styles": [
    ],
    "scripts": [
      "./js/controllers/sidebar.js",
      "./js/controllers/home.js"
    ],
    "nav": "home"
  },

  "home/carousel": {
    "html": "./html/pages/carousel.html",
    "styles": [
      "./css/carousel.css",
      "./css/components/carousel.css"
    ],
    "scripts": [
      "./js/controllers/sidebar.js",
      "./js/components/carousel.js",
      "./js/controllers/carousel.js"
    ],
    "nav": "home"
  },

  "home/videoplayer": {
    "html": "./html/pages/videoplayer.html",
    "styles": [
      "./css/components/videoplayer.css",
      "./css/videoplayer.css",
    ],
    "scripts": [
      "./js/controllers/sidebar.js",
      "./js/components/videoplayer.js",
      "./js/controllers/videoplayer.js"
    ],
    "nav": "home"
  }
};

config.nav = {
  "home": [
    {
      "title": "Home",
      "page": "home"
    },
    {
      "title": "Carousel",
      "page": "home/carousel"
    },
    {
      "title": "Video Player",
      "page": "home/videoplayer"
    }
  ]
}
