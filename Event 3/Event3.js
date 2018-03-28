
 window.onload = function() {


     var game = new Phaser.Game(1024, 768, Phaser.AUTO, '', { preload: preload, create: create, update: update });

    function preload() {
    game.load.baseURL = '';
    game.load.image('sky', 'assets/sky2.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

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


    game.physics.startSystem(Phaser.Physics.ARCADE);


    game.add.sprite(0, 0, 'sky');

    text = game.add.text(game.world.centerX*1.7,    game.world.centerY*0.16, '0:00', { font: "90px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
    game.time.events.loop(33, updateScore, this);


    platforms = game.add.group();


    platforms.enableBody = true;


    var ground = platforms.create(0, game.world.height - 64, 'ground');


    ground.scale.setTo(0, 0);


    ground.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');


    game.physics.arcade.enable(player);


    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    //  Our controls.
    cursors = game.input.keyboard.createCursorKeys();
    
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


    game.physics.arcade.collide(player, platforms);


    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {

        player.body.velocity.x = -150;

        player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {

        player.body.velocity.x = 150;

        player.animations.play('right');
    }
    else
    {
 
        player.animations.stop();

        player.frame = 4;
    }
    
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    }
};
