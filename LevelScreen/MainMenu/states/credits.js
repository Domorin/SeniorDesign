var Credits = function(game) {};

Credits.prototype = {

  preload: function () {
    this.optionCount = 1;
    this.creditCount = 0;

  },

  addCredit: function(task, author) {
    var authorStyle = { font: '40pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var taskStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
    var authorText = game.add.text(game.world.centerX, 900, author, authorStyle);
    var taskText = game.add.text(game.world.centerX, 950, task, taskStyle);
    authorText.anchor.setTo(0.5);
    authorText.stroke = "rgba(0,0,0,0)";
    authorText.strokeThickness = 4;
    authorText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    taskText.anchor.setTo(0.5);
    taskText.stroke = "rgba(0,0,0,0)";
    taskText.strokeThickness = 4;
    taskText.setShadow(3, 3, 'rgba(0,0,0,1)', 2);
    game.add.tween(authorText).to( { y: -300 }, 5000, Phaser.Easing.Cubic.Out, true, this.creditCount * 5000);
    game.add.tween(taskText).to( { y: -200 }, 5000, Phaser.Easing.Cubic.Out, true, this.creditCount * 5000);
    this.creditCount ++;
  },

  addMenuOption: function(text, callback) {
    var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
    var txt = game.add.text(10, (this.optionCount * 80) + 450, text, optionStyle);

    txt.stroke = "rgba(0,0,0,0";
    txt.strokeThickness = 4;
    var onOver = function (target) {
      target.fill = "#FEFFD5";
      target.stroke = "rgba(200,200,200,0.5)";
      txt.useHandCursor = true;
    };
    var onOut = function (target) {
      target.fill = "white";
      target.stroke = "rgba(0,0,0,0)";
      txt.useHandCursor = false;
    };
    //txt.useHandCursor = true;
    txt.inputEnabled = true;
    txt.events.onInputUp.add(callback, this);
    txt.events.onInputOver.add(onOver, this);
    txt.events.onInputOut.add(onOut, this);

    this.optionCount ++;
  },

  create: function () {
    this.stage.disableVisibilityChange = true;    
    var bg = game.add.sprite(0, 0, 'gameover-bg');
    this.addCredit('A Game Made for the 4-H Program By:', '');
    this.addCredit('Cody Lutzel', '');
    this.addCredit('Marco Wong', '');
    this.addCredit('Rahul Jevisetty', '');
    this.addCredit('David Qin', '');
    this.addCredit('Smit Shah', '');
    this.addCredit('Sunny Trivedi', '');
    this.addCredit('4-H Advisor:');
    this.addCredit('Pamela Gray');
    this.addCredit('Faculty Advisor:');
    this.addCredit('Professor Steve Demurjian');
    this.addMenuOption('<- Back', function (e) {
      game.state.start("GameMenu");
    });
    game.add.tween(bg).to({alpha: 0}, 20000, Phaser.Easing.Cubic.Out, true, 40000);
  }

};
