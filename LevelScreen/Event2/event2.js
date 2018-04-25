(
    function() {
    
    var game;

    EventTwo = function(currentGame){
        this.game = game;
        game = currentGame;
    };

        EventTwo.prototype = {
            preload: function() {
                preload();
            },
            create: function() {
                create();
            },
            update: function() {
                update();
            },
        };

function preload() {

    game.load.image('sky', 'event2/assets/back.png');
    game.load.image('ground', 'event2/assets/ground.png');
    game.load.spritesheet('dude', 'event2/assets/dude.png', 32, 48);
    game.load.spritesheet('baddie', 'event2/assets/fly.png', 32, 48);
    game.load.image("menu", "content/menu.png", 341, 128)

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
    // reset variables incase of retry
    flaps = 0;
    bflaps = 0;
    face = 0;

    game.world.width = 1024;
    game.world.height = 768;

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
    flapsText = game.add.text(16, 16, 'Flaps: 0', { fontSize: '26px', fill: '#000' });
    bflapsText = game.add.text(w-215, 16, 'Bug Flaps: 0', { fontSize: '26px', fill: '#000' });
    timeText = game.add.text(w/2-75, 16, 'Time left: 0', { fontSize: '26px', fill: '#000' });
	running = true;
	timer = game.time.create(false);
	// Timer in ms
	timer.loop(10000, gameover, this);
	// Start the Timer
	timer.start();

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
	
    // Code for the pause menu ///////////////////////////////////////////////////////////////////
    AddPauseMenu(game);    
	
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
	game.add.text(w/2-175, h/2-100, 'Total Flaps: ' + flaps, { fontSize: '48px', fill: '#F00' });
	game.add.text(w/2-250, h/2-50, 'Total Bug Flaps: ' + bflaps.toFixed(0), { fontSize: '48px', fill: '#F00' });

    DisplayBugFact(game, 3*game.height/4);
	
}

}());

