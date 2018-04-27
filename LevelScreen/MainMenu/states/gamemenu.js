(
    function() {

var game;
GameMenu = function(currentGame) {
  console.log("IN GAME MENU!");
  this.game = game;
  game = currentGame;
};


GameMenu.prototype = {

  menuConfig: {
    startY: 260,
    startX: 30
  },

  init: function () {
    game.world.setBounds(0, 0);
    game.camera.setPosition(0, 0);
    game.world.width = 1024;
    game.world.height = 768;

    this.titleText = game.make.text(game.world.centerX, 100, "4-H Bug Superheroes", {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;

  },

  create: function () {
    console.log("HELLO?");

    game.world.setBounds(0, 0);
    game.camera.setPosition(0, 0);

    game.world.width = 1024;
    game.world.height = 768;

    if (music.name !== "dangerous" && playMusic) {
      music.stop();
      music = game.add.audio('dangerous');
      music.loop = true;
      music.play();
    }
    game.stage.disableVisibilityChange = true;
    var sprite = game.add.sprite(0, 0, 'menu-bg');
    sprite.fixedToCamera = true;
    game.add.existing(this.titleText);

    this.addMenuOption('Start', function () {
      game.state.start("levsel");
    });
    this.addMenuOption('Options', function () {
      game.state.start("Options");
    });
    this.addMenuOption('Credits', function () {
      game.state.start("Credits");
    });


  },

  addMenuOption: function(text, callback, className) {

    // use the className argument, or fallback to menuConfig, but
    // if menuConfig isn't set, just use "default"
    className || (className = this.menuConfig.className || 'default');

    // set the x coordinate to game.world.center if we use "center"
    // otherwise set it to menuConfig.startX
    var x = this.menuConfig.startX === "center" ?
      game.world.centerX :
      this.menuConfig.startX;


    // set Y coordinate based on menuconfig
    var y = this.menuConfig.startY;

    console.log(y);

    // create
    var txt = game.add.text(
      x,
      (this.optionCount * 80) + y,
      text,
      style.navitem[className]
    );

    txt.fixedToCamera = true;

    // use the anchor method to center if startX set to center.
    txt.anchor.setTo(this.menuConfig.startX === "center" ? 0.5 : 0.0);

    txt.inputEnabled = true;

    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(function (target) {
      target.setStyle(style.navitem.hover);
    });
    txt.events.onInputOut.add(function (target) {
      target.setStyle(style.navitem[className]);
    });

    this.optionCount ++;
  }

};

//Phaser.Utils.mixinPrototype(GameMenu.prototype, mixins);




}());
