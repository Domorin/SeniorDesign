(
    function() {
    var game;

    EventFive = function(currentGame){
        this.game = game;
        game = currentGame;
    };

        EventFive.prototype = {
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
            
            function preload () {
                //game.stage.backgroundColor = '#85b5e1';
                game.load.baseURL = '';
                game.load.image('background', 'event5/Assets/sky.png');
                game.load.image('player', 'event5/Assets/phaser-dude.png');
                game.load.image('teammate', 'event5/Assets/phaser-dude.png');
                game.load.image('player2', 'event5/Assets/slime.png');
                game.load.image('platform', 'event5/Assets/platform.png');
                game.load.image('redFlag', 'event5/Assets/redflag.png');
                game.load.image('blueFlag', 'event5/Assets/blueflag.png');
                game.load.image("menu", "content/menu.png", 341, 128)
                
            }
            var redFlag;
            var blueFlag;
            var player;
            var player2;
            var teammate;
            var teammate2;
            var platforms;
            var cursors;
            var jumpButton;
            var line;
            var counter = 900;
            var text = 0;
            var background;
            var spriteWidth = 40;
            var spriteHeight = 60;
            var graphicsLine;
            var flag;
            var factDisplayed = false;            
           
            
            function create() {
                // reset variables incase of retry
                xVel = 80;
                tugVel = -900;
                start = true;
                gameNotOver = true;
                gameLost = false;
                youWon = false;
                antWon = false;
                minutes = 0;
                seconds = 0;
                factDisplayed = false;

                var spriteWidth = 40;
                var spriteHeight = 60;

                game.world.width = 1024;
                game.world.height = 768;


                game.add.tileSprite(-20,0,1044,768,'background');
                
                text = game.add.text(game.world.centerX,    game.world.centerY*0.22, '0:00', { font: "64px Lucida Sans", fill: "#ffffff", align: "center" });
                
                text.anchor.setTo(0.5, 0.5);
                
                game.time.events.loop(Phaser.Timer.SECOND, updateTimer, this);
                
                game.time.events.loop(33, updateScore, this);
                
                graphicsLine = game.add.graphics(0, 0);
                flag = game.add.graphics(0,0);
                
                redFlag = game.add.sprite(game.world.width*0.27,game.world.height*0.82, 'redFlag');
                
                blueFlag = game.add.sprite(game.world.width*0.73,game.world.height*0.82, 'blueFlag');
                
                teammate2 = game.add.sprite(game.world.width*0.37 - 120, game.world.height*0.85, 'teammate');
                
                player2 = game.add.sprite(game.world.width*0.63, game.world.height*0.85, 'player2');
                
                player = game.add.sprite(game.world.width*0.37, game.world.height*0.85, 'player');
                
                teammate = game.add.sprite(game.world.width*0.37 - 60, game.world.height*0.85, 'teammate');
                
                player.width = spriteWidth;
                player.height = spriteHeight;
                
                player2.width = 50;
                player2.height = spriteHeight;
                
                teammate.width = spriteWidth;
                teammate.height = spriteHeight;
                
                teammate2.width = spriteWidth;
                teammate2.height = spriteHeight;
                
                redFlag.width = 60;
                redFlag.height = 120;
                
                blueFlag.width = 60;
                blueFlag.height = 120;
                
                line = new Phaser.Line(teammate2.x+100, teammate2.y*0.7, player2.x-100, player2.y*0.7);
                
                game.physics.arcade.enable(player);
                game.physics.arcade.enable(player2);
                game.physics.arcade.enable(teammate);
                game.physics.arcade.enable(teammate2);

                player.body.collideWorldBounds = true;
                player.body.gravity.y = 500;

                teammate.body.collideWorldBounds = true;
                teammate.body.gravity.y = 500;

                teammate2.body.collideWorldBounds = true;
                teammate2.body.gravity.y = 500;

                player2.body.collideWorldBounds = true;
                player2.body.gravity.y = 500;

                platforms = game.add.physicsGroup();
                platforms.create(0, game.world.height*0.95
                                 , 'platform'); 
                platforms.create(game.world.width*0.5,game.world.height*0.95,'platform'); 

                platforms.setAll('body.immovable', true);

                cursors = game.input.keyboard.createCursorKeys();
                jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


                AddPauseMenu(game);

            }

            var flipFlop;
            var xVel = 80;
            var tugVel = -900;
            var start = true;
            var gameNotOver = true;
            var gameLost = false;
            var youWon = false;
            var antWon = false;
            var minutes = 0;
            var seconds = 0;
            
        function updateScore() {
            if (gameNotOver && !gameLost && counter > 200) {
                counter--;
            }
        }
            
        function updateTimer() {
                if (gameNotOver) {
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
                    if(!factDisplayed) {
                        factDisplayed = true;
                        DisplayBugFact(game, 3*game.height/4);
                    }
                }
                if (gameNotOver == false) {
                    text.setText("You Scored " + counter + "!");
                    if(!factDisplayed) {
                        DisplayBugFact(game, 3*game.height/4);
                        factDisplayed = true;
                    }
                }
            }           
            function update () {
                game.debug.geom(line);
                //game.debug.lineInfo(line, 32, 32);
                
                
                
                game.physics.arcade.collide(player, platforms);
                game.physics.arcade.collide(player2, platforms);
                game.physics.arcade.collide(teammate, platforms);
                game.physics.arcade.collide(teammate2, platforms);
                
                player.body.velocity.x = xVel;
                teammate.body.velocity.x = xVel;
                player2.body.velocity.x = xVel;
                teammate2.body.velocity.x = xVel;
                
                graphicsLine.clear();
                flag.clear();
                graphicsLine.lineStyle(4, 00000000, 1);
                flag.lineStyle(7,33300000,1);
                graphicsLine.moveTo(teammate2.x+10, teammate2.y+40);
                flag.moveTo(teammate2.x+270, teammate2.y+40);
                graphicsLine.lineTo(player2.x+10, player2.y+40);
                flag.lineTo(player2.x-100, player2.y+40);
                
                line.setTo(teammate2.x, teammate2.y+40, player2.x+10, player2.y+40);
                
                if (teammate2.body.position.x <= 0 || player2.body.position.x >= game.world.width*0.93) {
                    xVel = 0;
                    tugVel = 0;
                    gameNotOver = false; 
                } 
                if (player2.body.position.x >= game.world.width*0.84) {
                     xVel = 0;
                     tugVel = 0;
                     gameLost = true;
                }
                if (cursors.left.isDown){
                        if (!flipFlop) {
                            player.body.velocity.x = tugVel;
                            teammate.body.velocity.x = tugVel;
                            player2.body.velocity.x = tugVel;
                            teammate2.body.velocity.x = tugVel;
                            player.animations.stop('move');
                            teammate.animations.stop('move');
                            player2.animations.stop('move');
                            teammate2.animations.stop('move');
                            flipFlop = true;
                        }
                    }

                if (cursors.left.isUp) {
                        flipFlop = false;
                }
                
            }
            function winnerJump() {
                player.body.position.y += 10;
                teammate.body.position.y += 10;
                player2.body.position.y += 10;
                teammate2.body.position.y += 10;
    }

}());
