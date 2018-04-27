var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','image/lvl4background1024x768.png');
    game.load.image('player','image/phaser-dude.png');
	game.load.image('mushroom', 'image/sprites/maggot.png');
	game.load.spritesheet('ball', 'image/sprites/interference_ball_48x48.png', 48 ,48);
	game.load.spritesheet('coin', 'image/sprites/coin.png', 32 ,32);
	game.load.image('block', 'image/sprites/block.png', 5 ,5);
	game.load.image('flectrum','image/sprites/flectrum.png');
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
    player = game.add.sprite(300, 600, 'player');

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
	
	//enable AI
	test = game.add.group();
	test.enableBody = true;
	test.physicsBodyType = Phaser.Physics.ARCADE;
	tests = test.create(300,750,'mushroom');
	tests.body.collideWorldBounds = true;
	tests.body.bounce.setTo(0.4,0.4);
	
	game.physics.arcade.moveToXY(tests,200,200);
	//add obstacles 
	group = game.add.physicsGroup();
	group1 = game.add.physicsGroup();
	group2 = game.add.physicsGroup();
	//nondestructible
	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(200, 250), game.rnd.between(510, 530), 'ball',15);
	        c.body.immovable= true;
	    }
	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(750, 755), game.rnd.between(515, 520), 'ball',15);
	        c.body.immovable= true;
	    }
	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(200, 250), game.rnd.between(190, 200), 'ball',15);
	        c.body.immovable= true;
	    }
	    for (var i = 0; i < 10; i++)
	    {
	        var c = group.create(game.rnd.between(750, 755), game.rnd.between(190,200), 'ball',15);
	        c.body.immovable= true;
	    }
	    for (var i = 0; i < 1; i++)
	    {
	        var c = group2.create(game.rnd.between(150, 151), game.rnd.between(500,501), 'flectrum');
	        c.body.immovable= true;
	    }
		
	//bottom left corner
		for (var i =0 ; i< 3; i++)
		{
			var c = group1.create(game.rnd.between(0,50),game.rnd.between(690,695),'block', 1);
			c.body.immovable = true;
		}
		//bottom right corner
		for (var i =0 ; i< 3; i++)
		{
			var c = group1.create(game.rnd.between(900,950),game.rnd.between(660,670),'block', 1);
			c.body.immovable = true;
		}
		//bottom right corner
		for (var i =0 ; i< 3; i++)
		{
			var c = group1.create(game.rnd.between(970,975),game.rnd.between(575,576),'block', 1);
			c.body.immovable = true;
		}
		//top right corner
		for (var i =0 ; i< 5; i++)
		{
			var c = group1.create(game.rnd.between(980,985),game.rnd.between(70,90),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 5; i++)
		{
			var c = group1.create(game.rnd.between(900,950),game.rnd.between(10,30),'block', 1);
			c.body.immovable = true;
		}
		//left right corner
		for (var i =0 ; i< 5; i++)
		{
			var c = group1.create(game.rnd.between(0,50),game.rnd.between(20,30),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 5; i++)
		{
			var c = group1.create(game.rnd.between(0,50),game.rnd.between(10,30),'block', 1);
			c.body.immovable = true;
		}
		//bottom row
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(300,301),game.rnd.between(500,501),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(390,391),game.rnd.between(500,501),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(480,481),game.rnd.between(500,501),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(570,571),game.rnd.between(500,501),'block', 1);
			c.body.immovable = true;
		}
		{
			var c = group1.create(game.rnd.between(660,661),game.rnd.between(500,501),'block', 1);
			c.body.immovable = true;
		}
		// rightside 
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(739,740),game.rnd.between(330,331),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(738,739),game.rnd.between(420,421),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(740,741),game.rnd.between(240,241),'block', 1);
			c.body.immovable = true;
		}
		//top row
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(300,301),game.rnd.between(160,161),'block', 1);
			c.body.immovable = true;
		}
		{
			var c = group1.create(game.rnd.between(390,391),game.rnd.between(160,161),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(480,481),game.rnd.between(160,161),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(570,571),game.rnd.between(160,161),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(660,661),game.rnd.between(160,161),'block', 1);
			c.body.immovable = true;
		}
		//left side
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(210,211),game.rnd.between(240,241),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(210,211),game.rnd.between(420,421),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(210,211),game.rnd.between(330,331),'block', 1);
			c.body.immovable = true;
		}
		
		//finish line 
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(205,206),game.rnd.between(590,591),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(165,166),game.rnd.between(630,631),'block', 1);
			c.body.immovable = true;
		}
		for (var i =0 ; i< 1; i++)
		{
			var c = group1.create(game.rnd.between(155,156),game.rnd.between(660,661),'block', 1);
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
		   
 if (game.physics.arcade.collide(player, group2, collisionHandler3, processHandler3, this))
		   {
		          alert('You won!');
				  location.reload();
		 
		    }
 if (game.physics.arcade.collide(test, group2, collisionHandler4, processHandler4,this))
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