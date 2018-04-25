(
    function() {
    
    var game;

    EventThree = function(currentGame){
        this.game = game;
        game = currentGame;
    };

        EventThree.prototype = {
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
    game.load.image('sky', 'Event3/assets/sky2.png');
    game.load.image('ground', 'Event3/assets/platform.png');
    game.load.spritesheet('dude', 'Event3/assets/dude.png', 32, 48);
    game.load.image("menu", "content/menu.png", 341, 128)

    }

    var player;
    var platforms;
    var cursors;
    var counter = 900;
    var text = 0;
    var notOver = true;
    var gameLost = false;
    var minutes = 0;
    var seconds = 0;


    function create() {

    notOver = true;
    gameLost = false;
    minutes = 0;
    seconds = 0;

    game.world.width = 1024;
    game.world.height = 768;

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'sky');

    text = game.add.text(game.world.centerX*1.7,    game.world.centerY*0.16, '0:00', { font: "90px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
    game.time.events.loop(33, updateScore, this);

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    //  We will enable physics for any object that is created in this group
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 120, 'ground');

    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(0, 0);

    //  This stops it from falling away when you jump on it
    ground.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();

    AddPauseMenu(game); 
    
    }
function updateScore() {
        if (notOver && !gameLost && counter > 200) {
            counter--;
        }
    }

function updateTimer() {
            if (notOver) {
                if (seconds == 59) {
                    seconds = 0;
                    minutes++;
                    text.setText(minutes + ":00");
                } else {
                    seconds++;
                    if (seconds < 10) {
                        text.setText(minutes + ":0" + seconds);
                    } else {
                        text.setText(minutes + ":" + seconds);
                    }
                }
            }
            if (gameLost) {
                text.setText("The Other Team Won!");
            }
            if (notOver == false) {
                text.setText("You Scored " + counter + "!");
            }
        }  

    function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }
    
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    }

}());