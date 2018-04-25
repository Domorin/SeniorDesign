// Global Variables
  var game;
  Main = function (currentGame) {
    this.game = game;
    game = currentGame;
  },
  gameOptions = {
    playSound: true,
	  playMusic: true
  },




Main.prototype = {

  preload: function () {
    game.load.image('grass',    'MainMenu/assets/images/grass1.png');
    game.load.image('loading',  'MainMenu/assets/images/loading.png');
    game.load.image('brand',    'MainMenu/assets/images/logo.jpg');
    game.load.script('polyfill',   'MainMenu/lib/polyfill.js');
    game.load.script('utils',   'MainMenu/lib/utils.js');
    game.load.script('splash',  'MainMenu/states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};
