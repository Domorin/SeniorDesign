var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {

    game.load.image('sky', 'assets/back.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'assets/fly.png', 32, 48);

}

var player;
var platforms;
var bug;
var cursors;
var flaps = 0;
var flapsText;
var bflaps = 0;
var bflapsText;
var timeText;
var timer;
var running;
var w = 1024, h = 768;

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, h - 100, 'ground');

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(w/3 + 75, h/2, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;


    // The Bug and its settings
    bug = game.add.sprite(2*w/3 - 75, h/2, 'baddie');

    //  We need to enable physics on the bug
    game.physics.arcade.enable(bug);

    //  Player physics properties. Give the little guy a slight bounce.
    bug.body.bounce.y = 0.2;
    bug.body.gravity.y = 500;
    bug.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    //player.animations.add('wiggle', [1,8], 10, true);

    //  The score & timer
    flapsText = game.add.text(16, 16, 'Flaps: 0', { fontSize: '32px', fill: '#000' });
    bflapsText = game.add.text(w-215, 16, 'Bug Flaps: 0', { fontSize: '32px', fill: '#000' });
    timeText = game.add.text(w/2-75, 16, 'Time left: 0', { fontSize: '32px', fill: '#000' });
	running = true;
	timer = game.time.create(false);
	// Timer in ms
	timer.loop(10000, gameover, this);
	// Start the Timer
	timer.start();

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
	
    // Code for the pause menu ///////////////////////////////////////////////////////////////////
    

    // Create a label to use as a button
    pause_label = game.add.text(w - 100, h-50, 'Pause', { fontSize: '32px', fill: '#000' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;

        // Then add the menu
        menu = game.add.sprite(w/2, h/2, 'menu'); // need sprite
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', { fontSize: '32px', fill: '#000' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
                y1 = h/2 - 180/2, y2 = h/2 + 180/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four', 'five', 'six'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice 
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();

                // Unpause the game
                game.paused = false;
            }
        }
	};
	
}

var face = 0;

function update() {

    //  Collide the player & bug with the platforms
    game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(bug, platforms);

    //  Reset the player & bug velocity (movement)
    player.body.velocity.x = 0;
	bug.body.velocity.x = 0;

	// Player Flaps
    if (cursors.left.isDown && running)
    {
		if (face != -1) {
			player.body.velocity.y = -10;
			flaps += 1;
			flapsText.text = 'Flaps: ' + flaps;
		}
		face = -1;
		player.frame = 1;	
    }
	else if (cursors.right.isDown && running)
	{
		if (face != 1)
		{
			player.body.velocity.y = -10;
			flaps += 1;
			flapsText.text = 'Flaps: ' + flaps;
		}
		face = 1;
		player.frame = 8;
	}
    else
    {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }
	
	// Bug Flaps
    if (((timer.duration)).toFixed(0)%2 == 1 && running)
    {
			bug.body.velocity.y = -20;
			bflaps += 1.7;
			bflapsText.text = 'Bug Flaps: ' + bflaps.toFixed(0);
		
		// Update sprite sheet
		bug.frame = 2;	
    }
	else if (((timer.duration)).toFixed(0)%2 == 0 && running)
	{
			bug.body.velocity.y = -20;
			bflaps += 1.7;
			bflapsText.text = 'Bug Flaps: ' + bflaps.toFixed(0);
		
		// Update sprite sheet
		bug.frame = 1;
	}
    else
    {
        //  Stand still
        bug.animations.stop();
        bug.frame = 1;
    }

	if (running) {
		// Update Timer
		timeText.text = 'Time left: ' + (timer.duration/1000).toFixed(0);
	}

}


function gameover() {
	
	running = false;
	game.add.text(w/2-75, h/2-100, 'Total Flaps: ' + flaps, { fontSize: '64px', fill: '#F00' });
	game.add.text(w/2-125, h/2-50, 'Total Bug Flaps: ' + bflaps.toFixed(0), { fontSize: '64px', fill: '#F00' });
	
}
