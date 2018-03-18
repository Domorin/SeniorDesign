var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','image/lvl4background.png');
    game.load.image('player','image/phaser-dude.png');
	game.load.image('mushroom', 'image/sprites/maggot.png');
	game.load.spritesheet('veggies', 'image/sprites/fruitnveg32wh37.png', 32, 32);
}

var player;
var cursors;
var angle = 0;
var group;

function create() {

    game.add.tileSprite(0, 0, 1920, 1920, 'background');

    game.world.setBounds(0, 0, 800, 600);

    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(300, 500, 'player');

    game.physics.arcade.enable(player);
	
    game.camera.follow(player);
	game.input.onDown.add(moveBall, this);
	
	game.time.events.add(Phaser.Timer.SECOND * 30.00, quit, this);
	
	test = game.add.sprite(300, 500, 'mushroom');
	game.physics.arcade.enable(test);
	
	group = game.add.physicsGroup();

	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(0, 35));
	        c.body.mass = -100;
	    }

	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 17);
	    }

}

function onDragStart(sprite, pointer) {

    result = "Dragging " + sprite.key;

}

function update() {

  
  if (game.physics.arcade.collide(player, group, collisionHandler, processHandler, this))
     {
         console.log('boom');
     }
	 
  if (game.physics.arcade.collide(test, group, collisionHandler1, processHandler1,this))
        {
            console.log('boom');
        }
	
  if (test.y > 400){
  	test.x += 0.3;
  	test.y -= 0.065;
  }
  else if (300< test.y <= 400){
  	test.y -= 0.3;
  }
  else {
	  test.x += 10;
	  test.y += 10;
  }
}


function moveBall() {

    //  If we don't it'll look very wrong
    game.camera.follow();

    game.physics.arcade.moveToPointer(player, 75);

    //  The maxTime parameter lets you control how fast it will arrive at the Pointer coords
    // game.physics.arcade.moveToPointer(ball, 100, game.input.activePointer, 1000);


}

function processHandler (player, veg) {

    return true;

}

function collisionHandler (player, veg) {

    if (veg.frame == 17)
    {
        veg.kill();
    }
}
function processHandler1 (test, veg) {

	    return true;

	}

function collisionHandler1 (test, veg) {

	    if (veg.frame == 18)
	    {
	        veg.kill();
	    }
}
function quit () {
	
	if (game.time.events == 0) {
		stateText.text=" GAME OVER \n Click to restart";
		        stateText.visible = true;

		        //the "click to restart" handler
		        game.input.onTap.addOnce(restart,this);
	}
}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
	game.debug.text("Time until event: " + game.time.events.duration, 200, 100);

}