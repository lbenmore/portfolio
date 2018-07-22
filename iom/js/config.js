const app = {
  pages: {
    signin: {
      html: './pages/signin.html',
      stylesheets: [
        './css/auth_forms.css'
      ],
      scripts: [
        './js/controllers/signin.js'
      ]
    },
    signup: {
      html: './pages/signup.html',
      stylesheets: [
        './css/auth_forms.css'
      ],
      scripts: [
        './js/controllers/signup.js'
      ]
    },
    home: {
      html: './pages/home.html',
      stylesheets: [
      ],
      scripts: [
        './js/controllers/home.js'
      ]
    }
  }
};
