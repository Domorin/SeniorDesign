var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('background','image/debug-grid-1920x1920.png');
    game.load.image('player','image/phaser-dude.png');
	game.load.image('mushroom', 'image/mushroom2.png');

}

var player;
var cursors;

function create() {

    game.add.tileSprite(0, 0, 1920, 1920, 'background');

    game.world.setBounds(0, 0, 1920, 1920);

    game.physics.startSystem(Phaser.Physics.P2JS);

    player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

    game.physics.p2.enable(player);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);
	
	game.time.events.add(Phaser.Timer.SECOND * 30.00, quit, this);
	
	test = game.add.sprite(game.world.centerX, game.world.centerY, 'mushroom');
	
	
	

}

function update() {

    player.body.setZeroVelocity();

    if (cursors.up.isDown)
    {
        player.body.moveUp(300)
    }
    else if (cursors.down.isDown)
    {
        player.body.moveDown(300);
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = 0;
    }
    else if (cursors.right.isDown)
    {
        player.body.moveRight(0);
    }
	
	test.y += 0.1;
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