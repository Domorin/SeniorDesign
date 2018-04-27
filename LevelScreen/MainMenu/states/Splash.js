var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'MainMenu/lib/style.js');
    game.load.script('mixins', 'MainMenu/lib/mixins.js');
    game.load.script('WebFont', 'MainMenu/vendor/webfontloader.js');
    game.load.script('gamemenu','MainMenu/states/GameMenu.js');
    game.load.script('game', 'MainMenu/states/Game.js');
    game.load.script('gameover','MainMenu/states/GameOver.js');
    game.load.script('credits', 'MainMenu/states/Credits.js');
    game.load.script('options', 'MainMenu/states/Options.js');
  },

  loadBgm: function () {
    // thanks Kevin Macleod at http://incompetech.com/
    game.load.audio('dangerous', 'MainMenu/assets/bgm/Dangerous.mp3');
    game.load.audio('exit', 'MainMenu/assets/bgm/Exit the Premises.mp3');
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('menu-bg', 'MainMenu/assets/images/menu-bg2.png');
    game.load.image('options-bg', 'MainMenu/assets/images/options1024x768.png');
    game.load.image('gameover-bg', 'MainMenu/assets/images/gameover1024x768png.png');
  },

  loadFonts: function () {
    WebFontConfig = {
      custom: {
        families: ['TheMinion'],
        urls: ['MainMenu/assets/style/theminion.css']
      }
    }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, "loading");
    this.logo       = game.make.sprite(game.world.centerX, 200, 'brand');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'white'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'grass');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add("GameMenu",GameMenu);
    game.state.add("levsel",LevelSelect);
    game.state.add("GameOver",GameOver);
    game.state.add("Credits",Credits);
    game.state.add("Options",Options);
  },

  addGameMusic: function () {
    music = game.add.audio('dangerous');
    music.loop = true;
    music.play();
  },

  create: function() {
    this.status.setText('Ready!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start("GameMenu");
    }, 1000);
  }
};
