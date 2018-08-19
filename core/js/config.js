var config = {};

config.pages = {
  "home": {
    "html": "./html/pages/home.html",
    "styles": [
    ],
    "scripts": [
      "./js/components/sidebar.js",
      "./js/controllers/home.js"
    ],
    "subnav": "home"
  },

  "home/carousel": {
    "html": "./html/pages/carousel.html",
    "styles": [
      "./css/carousel.css",
      "./css/components/carousel.css"
    ],
    "scripts": [
      "./js/components/sidebar.js",
      "./js/components/carousel.js",
      "./js/controllers/carousel.js"
    ],
    "subnav": "home"
  },

  "home/videoplayer": {
    "html": "./html/pages/videoplayer.html",
    "styles": [
      "./css/components/videoplayer.css"
    ],
    "scripts": [
      "./js/components/sidebar.js",
      "./js/components/videoplayer.js",
      "./js/controllers/videoplayer.js",
    ],
    "subnav": "home"
  }
};

config.subnav = {
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
