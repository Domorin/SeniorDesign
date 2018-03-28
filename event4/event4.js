var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','image/lvl4background1024x768.png');
    game.load.image('player','image/phaser-dude.png');
	game.load.image('mushroom', 'image/sprites/maggot.png');
	game.load.spritesheet('ball', 'image/sprites/interference_ball_48x48.png', 48 ,48);
	game.load.spritesheet('coin', 'image/sprites/coin.png', 32 ,32);
	game.load.image('block', 'image/sprites/block.png', 5 ,5);
}

var player;
var cursors;
var angle = 0;
var group;
var test;
var block;
function create() {
	
	//setbounds
	game.world.setBounds(0,0,1024,768);

    //add background
	game.add.tileSprite(0, 0, 1024, 768, 'background');

    //start physics
	game.physics.startSystem(Phaser.Physics.P2JS);
	
	//add player
    player = game.add.sprite(300, 500, 'player');

	//enable player physics
    game.physics.arcade.enable(player);
	
	//mouse pointer functionality
	game.input.onDown.add(moveBall, this);
	
	//add timer
	game.time.events.add(Phaser.Timer.SECOND * 30.00, quit, this);
	
	player.body.collideWorldBounds = true;
	player.body.bounce.setTo(0.9,0.9);
	
	player.body.mass = 100;
	game.input.addPointer();
	//add AI
	//test = game.add.sprite(300, 500, 'mushroom');
	
	//enable AI
	test = game.add.group();
	test.enableBody = true;
	test.physicsBodyType = Phaser.Physics.ARCADE;

	
	for (var y = 0; y < 1; y++)
	    {
	        for (var x = 0; x < 1; x++)
	        {	
				var tests = test.create(300, 500, 'mushroom')
	            tests.name = 'mushroom' + x.toString() + y.toString();
	           	tests.body.collideWorldBounds = true;
			    tests.body.bounce.setTo(0.9,0.9);
	            tests.body.velocity.x = 10 + Math.random()*100;
				tests.body.velocity.y = 10 + Math.random()*100;
			
	        }
		}
	
	//add obstacles 
	group = game.add.physicsGroup();
	group1 = game.add.physicsGroup();
		//nondestructible
	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(80, 90), game.rnd.between(50, 500), 'ball', 15);
	        c.body.immovable= true;
	    }
		//destructible
	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(200, 400), game.rnd.between(60, 100), 'coin', 0);
	    }
		
		for (var i =0 ; i< 5; i++)
		{
			var c = group1.create(game.rnd.between(0,75),game.rnd.between(630,675),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(700,700),game.rnd.between(200,400),'block', 1);
			c.body.immovable = true;
		}
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
		
if (game.physics.arcade.collide(player, group1, collisionHandler3, processHandler3, this))
	       {
	           console.log('boom');
		 
	       }
	 
	 
	   if (game.physics.arcade.collide(test, group1, collisionHandler4, processHandler4,this))
	          {
	              console.log('boom');
	          }
}


function moveBall() {

    //  If we don't it'll look very wrong
   // game.camera.follow();

    game.physics.arcade.moveToPointer(player, 100, game.input.activePointer);

    //  The maxTime parameter lets you control how fast it will arrive at the Pointer coords
    // game.physics.arcade.moveToPointer(ball, 100, game.input.activePointer, 1000);


}

function processHandler (player, veg) {

    return true;

}

function collisionHandler (player, veg) {

    if (veg.frame == 0)
    {
        veg.kill();
    }
}
function processHandler1 (tests, veg) {

	    return true;

	}

function collisionHandler1 (tests, veg) {

	    if (veg.frame == 0)
	    {
	        veg.kill();
	    }
}

function processHandler3 (player, veg) {

    return true;

}

function collisionHandler3 (player, veg) {

    if (veg.frame == 0)
    {
		veg.body.immovable = true;
    }
}
function processHandler4 (tests, veg) {

	    return true;

	}

function collisionHandler4 (tests, veg) {

	    if (veg.frame == 0)
	    {
	       veg.body.immovable = true;
	    }
}


function testOut(tests) {

    //  Move the alien to the top of the screen again
    tests.reset(x, this);

    //  And give it a new random velocity
    tests.body.velocity.x = 50 + Math.random() * 200;

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
    game.debug.spriteCoords(player, 0, 680);
	game.debug.text("Time until event: " + game.time.events.duration, 0, 728);

}