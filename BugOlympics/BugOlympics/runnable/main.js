define("Event1/chargeMeter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeMeter = (function () {
        function ChargeMeter(player) {
            this.RECT_WIDTH = 7;
            this.maxPower = false;
            this.player = player;
            this.polygon = new Phaser.Polygon([0, 0]);
        }
        ChargeMeter.prototype.update = function (scene) {
            var myScene = scene;
            var pointer = myScene.activePointer;
            if (this.player.beingDragged) {
                // Calculate distance between player and pointer
                var dragDistance = Math.sqrt(Math.pow((pointer.worldY - this.player.sprite.body.center.y), 2) + Math.pow((pointer.worldX - this.player.sprite.body.center.x), 2));
                // Ensure distance is no greater than MAX_DRAG_DISTANCE
                if (dragDistance > this.player.MAX_DRAG_DISTANCE) {
                    dragDistance = this.player.MAX_DRAG_DISTANCE;
                    this.maxPower = true;
                }
                else {
                    this.maxPower = false;
                }
                // Get angle between the center of the player and the pointer
                var angle = -Math.atan2(pointer.worldY - this.player.sprite.body.center.y, pointer.worldX - this.player.sprite.body.center.x) + Math.PI;
                // Calculate and set the polygon points for the launch meter
                this.calculatePolygonPoints(dragDistance, angle);
                // Input was released, launch the player!
                if (pointer.isUp) {
                    // This should not be set here
                    this.player.beingDragged = false;
                    // Set velocity of the player according to the angle and distance
                    var speed = dragDistance * this.player.VELOCITY_MODIFIER;
                    var xVel = speed * Math.cos(angle);
                    var yVel = -speed * Math.sin(angle);
                    this.player.sprite.body.velocity.setTo(xVel, yVel);
                }
            }
        };
        ChargeMeter.prototype.calculatePolygonPoints = function (dragDistance, angle) {
            var startPointX = this.player.sprite.body.center.x + dragDistance * -Math.cos(angle);
            var startPointY = this.player.sprite.body.center.y + dragDistance * Math.sin(angle);
            var pointAngle = angle - Math.PI / 2;
            var p1 = new Phaser.Point(this.player.sprite.body.center.x - this.RECT_WIDTH * Math.cos(pointAngle), this.player.sprite.body.center.y + this.RECT_WIDTH * Math.sin(pointAngle));
            var p2 = new Phaser.Point(this.player.sprite.body.center.x + this.RECT_WIDTH * Math.cos(pointAngle), this.player.sprite.body.center.y - this.RECT_WIDTH * Math.sin(pointAngle));
            var p3 = new Phaser.Point(startPointX - this.RECT_WIDTH * Math.cos(pointAngle), startPointY + this.RECT_WIDTH * Math.sin(pointAngle));
            var p4 = new Phaser.Point(startPointX + this.RECT_WIDTH * Math.cos(pointAngle), startPointY - this.RECT_WIDTH * Math.sin(pointAngle));
            this.polygon.setTo([p1, p2, p4, p3]);
        };
        ChargeMeter.prototype.render = function (graphics) {
            if (this.player.beingDragged) {
                if (this.player.chargeMeter.maxPower) {
                    // Seizure warning				
                    graphics.beginFill((Math.random() * 0xFFFFFF));
                }
                else {
                    graphics.beginFill(0xFF0000);
                }
                graphics.drawPolygon(this.polygon.points);
                graphics.endFill();
            }
        };
        return ChargeMeter;
    }());
    exports.ChargeMeter = ChargeMeter;
});
define("Event1/Player", ["require", "exports", "Event1/chargeMeter"], function (require, exports, chargeMeter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function () {
        function Player(sprite) {
            var _this = this;
            // Constants
            this.VELOCITY_MODIFIER = 5;
            this.MAX_DRAG_DISTANCE = 125;
            this.GRAVITY = 300;
            this.RECT_WIDTH = 7;
            this.beingDragged = false;
            this.onGround = true;
            this.currentScreen = 1;
            this.changedScreens = false;
            console.log("Creating player!");
            this.sprite = sprite;
            this.sprite.body.bounce.y = 0.2;
            this.sprite.body.gravity.y = 300;
            this.sprite.body.collideWorldBounds = true;
            this.sprite.body.stopVelocityOnCollide = true;
            this.sprite.inputEnabled = true;
            this.chargeMeter = new chargeMeter_1.ChargeMeter(this);
            this.sprite.events.onInputDown.add(function (s) {
                return _this.playerClicked(s);
            });
        }
        Player.prototype.update = function (scene) {
            var myScene = scene;
            var prevScreen = this.currentScreen;
            this.currentScreen = Math.floor(this.sprite.position.x / myScene.game.width);
            if (prevScreen != this.currentScreen) {
                this.changedScreens = true;
            }
            else {
                this.changedScreens = false;
            }
            console.log("UPDATING!");
            //  Collide the player with the platforms and pillars
            var hitPlatform = myScene.game.physics.arcade.collide(this.sprite, myScene.ground);
            var hitPillar = myScene.game.physics.arcade.collide(this.sprite, myScene.pillars);
            if (hitPillar) {
                this.sprite.position.x = myScene.playerSpawnPoint.x;
                this.sprite.position.y = myScene.playerSpawnPoint.y;
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;
            }
            // If players feet are touching the floor, set X velocity to 0
            if (hitPlatform) {
                this.hitPlatform();
            }
            else {
                this.onGround = false;
            }
            // Don't allow any charging if camera is moving
            if (!myScene.cameraMoving) {
                this.sprite.body.enable = true;
                this.chargeMeter.update(scene);
            }
            else {
                this.sprite.body.enable = false;
            }
        };
        Player.prototype.hitPlatform = function () {
            console.log("hello?");
            this.sprite.body.velocity.x = 0;
            this.onGround = true;
        };
        Player.prototype.playerClicked = function (s) {
            if (this.onGround) {
                this.beingDragged = true;
            }
        };
        Player.prototype.render = function (graphics) {
            this.chargeMeter.render(graphics);
        };
        return Player;
    }());
    exports.Player = Player;
});
define("Utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Utils = (function () {
        function Utils() {
        }
        Utils.randomIntFromInterval = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        return Utils;
    }());
    exports.Utils = Utils;
});
define("Event1/Flea", ["require", "exports", "Utils"], function (require, exports, Utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Flea = (function () {
        function Flea(sprite, timer) {
            this.GRAVITY = 300;
            this.INITIAL_HOPS = 5;
            this.HOP_MIN_VELOCITY = 125;
            this.HOP_MAX_VELOCITY = 75;
            this.HOP_DELAY = 1000;
            this.currentHops = 0;
            this.X_LEAP_VELOCITY = 200;
            this.initialCutscene = true;
            this.sprite = sprite;
            this.sprite.body.bounce.y = 0.2;
            this.sprite.body.gravity.y = this.GRAVITY;
            this.sprite.body.collideWorldBounds = true;
            this.sprite.body.stopVelocityOnCollide = true;
            this.onGround = true;
            this.timer = timer;
            this.timer.start();
            this.startHop();
            this.leaping = false;
            this.cutsceneEndedSignal = new Phaser.Signal();
        }
        Flea.prototype.startHop = function () {
            this.currentHops = 0;
            console.log("STARITNG HOP!!");
            this.timer.start();
            this.timer.add(this.HOP_DELAY, this.hop, this);
        };
        Flea.prototype.hop = function () {
            this.currentHops++;
            var hopVelocity = Utils_1.Utils.randomIntFromInterval(this.HOP_MIN_VELOCITY, this.HOP_MAX_VELOCITY);
            this.sprite.body.velocity.y = -hopVelocity;
            var hopInterval = 2 * hopVelocity / this.GRAVITY * 1000;
            var funcToAdd = this.hop;
            if (this.currentHops >= this.INITIAL_HOPS) {
                funcToAdd = this.leap;
            }
            this.timer.add(hopInterval, funcToAdd, this);
        };
        Flea.prototype.leap = function () {
            this.leaping = true;
            var time = 1024 / this.X_LEAP_VELOCITY;
            var yVelocity = 1 / 2 * time * -this.GRAVITY;
            this.sprite.body.velocity.y = yVelocity;
            this.sprite.body.velocity.x = this.X_LEAP_VELOCITY;
        };
        Flea.prototype.hitPlatform = function () {
            this.onGround = true;
            this.sprite.body.velocity.x = 0;
            if (this.leaping) {
                this.cutsceneEndedSignal.dispatch();
                this.leaping = false;
                this.startHop();
            }
        };
        Flea.prototype.update = function (scene) {
            var fleaCollided = scene.game.physics.arcade.collide(this.sprite, scene.ground, this.hitPlatform, null, this);
        };
        return Flea;
    }());
    exports.Flea = Flea;
});
define("Event1/StandingsRail", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StandingsRail = (function () {
        function StandingsRail(game, playerKey, fleaKey, tileSpriteKey) {
            this.HORIZONTAL_BUFFER = 64;
            this.VERTICAL_BUFFER = 64;
            this.game = game;
            this.tileSpriteKey = tileSpriteKey;
            this.createRail(this.game, this.tileSpriteKey, playerKey, fleaKey);
            this.setVisible(false);
        }
        StandingsRail.prototype.createRail = function (game, tileSpriteKey, playerKey, fleaKey) {
            this.tileWidth = game.cache.getImage(tileSpriteKey).width;
            this.tileHeight = game.cache.getImage(tileSpriteKey).height;
            this.numOfTiles = Math.floor((game.width - this.HORIZONTAL_BUFFER * 2) / this.tileWidth);
            this.railLength = this.tileWidth * this.numOfTiles;
            this.railTiles = game.add.group();
            var y = game.height - this.VERTICAL_BUFFER - this.tileHeight / 2;
            var x = this.HORIZONTAL_BUFFER;
            for (var i = 0; i < this.numOfTiles; i++) {
                var curSprite = game.add.sprite(x, y, tileSpriteKey);
                this.railTiles.add(curSprite);
                curSprite.fixedToCamera = true;
                x += this.tileWidth;
            }
            this.fleaHead = game.add.sprite(0, 0, fleaKey);
            this.fleaHead.x = this.HORIZONTAL_BUFFER - this.fleaHead.width / 2;
            this.fleaHead.y = game.height - this.VERTICAL_BUFFER - this.tileHeight / 2 - this.fleaHead.height * 1 / 2;
            this.fleaHead.fixedToCamera = true;
            this.playerHead = game.add.sprite(0, 0, playerKey);
            this.playerHead.x = this.HORIZONTAL_BUFFER - this.playerHead.width / 2;
            this.playerHead.y = game.height - this.VERTICAL_BUFFER - this.tileHeight / 2 - this.playerHead.height * 1 / 2;
            this.playerHead.fixedToCamera = true;
        };
        StandingsRail.prototype.setVisible = function (visibility) {
            this.railTiles.setAll("visible", visibility);
            this.fleaHead.visible = visibility;
            this.playerHead.visible = visibility;
        };
        StandingsRail.prototype.update = function (scene) {
            var myScene = scene;
            var playerProgressRatio = myScene.player.sprite.x / myScene.worldDimensions.x;
            this.playerHead.cameraOffset.x = this.HORIZONTAL_BUFFER - this.playerHead.width / 2 + playerProgressRatio * this.railLength;
            var fleaProgressRatio = myScene.flea.sprite.x / myScene.worldDimensions.x;
            this.fleaHead.cameraOffset.x = this.HORIZONTAL_BUFFER - this.fleaHead.width / 2 + fleaProgressRatio * this.railLength;
        };
        return StandingsRail;
    }());
    exports.StandingsRail = StandingsRail;
});
/// <reference path="Player.ts" />
define("Event1/EventOne", ["require", "exports", "Event1/Player", "Event1/Flea", "Event1/StandingsRail"], function (require, exports, Player_1, Flea_1, StandingsRail_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventOne = (function () {
        function EventOne() {
            this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'content', this);
        }
        EventOne.prototype.preload = function () {
            this.game.load.image('pillarTile', 'content/pillarTile.png');
            this.game.load.image('sky', 'content/sky.png');
            this.game.load.image('ground', 'content/platform.png');
            this.game.load.image('flea', 'content/fleaStanding.png');
            this.game.load.image('standingsRail', 'content/trackTile.png');
            this.game.load.image('playerHead', 'content/playerHead.png');
            this.game.load.image('fleaHead', 'content/fleaHead.png');
            this.game.load.spritesheet('dude', 'content/dude.png', 32, 48);
        };
        EventOne.prototype.create = function () {
            console.log("Creating!");
            this.initialCutscene = true;
            this.pillarMaxSpawnX = this.game.width * 9 / 10;
            this.pillarMinSpawnX = this.game.width / 2;
            this.pillarMaxHoleSize = 300;
            this.pillarMinHoleSize = 100;
            this.pillarMinHoleY = 150;
            this.pillarMaxHoleY = this.game.height - this.pillarMaxHoleSize - 40;
            this.numberOfScreens = 5;
            //  Use Arcade Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.worldDimensions = new Phaser.Point(this.game.width * (this.numberOfScreens), this.game.height * 3);
            this.game.world.setBounds(0, 0, this.worldDimensions.x, this.worldDimensions.y);
            var pillarTileHeight = this.game.cache.getImage("pillarTile").height;
            //  A simple background for our game
            var backgroundWidth = this.game.cache.getImage("sky").width;
            var backgroundHeight = this.game.cache.getImage("sky").height;
            // Adding the mutliple background images to fit the world space if needed
            // We could just scale the ground texture instead, but it would look ugly it wasn't just a solid color
            for (var x = 0; x < this.worldDimensions.x; x += backgroundWidth) {
                var curSprite = this.game.add.sprite(x, 0, 'sky');
                // Scale the sky's height to match the world height
                curSprite.height = this.worldDimensions.y;
            }
            this.pillars = this.game.add.group();
            this.pillars.enableBody = true;
            this.createPillars(this.game.cache.getImage("pillarTile").height);
            this.pillars.setAll('body.immovable', true);
            //  The platforms group contains the ground and the 2 ledges we can jump on
            this.ground = this.game.add.group();
            //  We will enable physics for any object that is created in this group
            this.ground.enableBody = true;
            // Here we create the ground.
            var ground = this.ground.create(0, this.game.world.height - 128, 'ground');
            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(3 * this.numberOfScreens, 4);
            //  Set the immovable property for all objects in the platforms group.
            this.ground.setAll('body.immovable', true);
            this.playerSpawnPoint = new Phaser.Point(150 + this.game.width, this.game.world.height - 128 - this.game.cache.getImage('dude').height - 5);
            this.fleaSpawnPoint = new Phaser.Point(this.playerSpawnPoint.x - 50 - this.game.width, this.playerSpawnPoint.y);
            var playerSprite = this.game.add.sprite(this.playerSpawnPoint.x, this.playerSpawnPoint.y, 'dude', 8);
            //  We need to enable physics on the player
            this.game.physics.arcade.enable(playerSprite);
            this.player = new Player_1.Player(playerSprite);
            this.createFlea();
            this.game.camera.bounds = new Phaser.Rectangle(0, 0, this.worldDimensions.x, this.worldDimensions.y);
            this.cameraMoving = false;
            this.cameraMoveSpeed = 20;
            this.camera.follow(this.flea.sprite);
            this.graphics = this.game.add.graphics(0, 0);
            var style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.score = this.game.add.text(this.game.width - 55, 5, "1/" + this.numberOfScreens, style);
            this.score.fixedToCamera = true;
            this.player.sprite.body.enable = false;
            this.flea.cutsceneEndedSignal.add(this.endCutscene, this);
            this.createStandingsRail();
        };
        EventOne.prototype.endCutscene = function () {
            if (this.initialCutscene) {
                this.initialCutscene = false;
                this.player.sprite.body.enable = true;
                this.camera.unfollow();
                this.cameraMoving = true;
                this.standingsRail.setVisible(true);
            }
        };
        EventOne.prototype.createStandingsRail = function () {
            this.standingsRail = new StandingsRail_1.StandingsRail(this.game, 'playerHead', 'fleaHead', 'standingsRail');
        };
        EventOne.prototype.createFlea = function () {
            var fleaSprite = this.game.add.sprite(this.fleaSpawnPoint.x, this.fleaSpawnPoint.y, 'flea');
            this.game.physics.arcade.enable(fleaSprite);
            this.flea = new Flea_1.Flea(fleaSprite, this.game.time.create(false));
        };
        EventOne.prototype.createPillars = function (pillarTileHeight) {
            // Do not have a pillar on the last screen
            for (var i = 0; i < this.numberOfScreens - 1; i++) {
                var x = this.randomIntFromInterval(this.pillarMinSpawnX, this.pillarMaxSpawnX) + (i * this.game.width);
                var holeY = this.randomIntFromInterval(this.pillarMinHoleY, this.pillarMaxHoleY);
                var holeSize = this.randomIntFromInterval(this.pillarMinHoleSize, this.pillarMaxHoleSize);
                console.log("Creating Pillar:");
                console.log("X: ", x);
                console.log("Hole Y:", holeY);
                console.log("Hole Size:", holeSize);
                this.createPillar(x, holeY, holeSize, pillarTileHeight);
            }
        };
        EventOne.prototype.createPillar = function (x, holeY, holeSize, pillarTileHeight) {
            for (var curHeight = this.worldDimensions.y - this.game.height; curHeight < this.worldDimensions.y; curHeight += pillarTileHeight) {
                var holeLocation = this.worldDimensions.y - holeY - holeSize;
                if (curHeight >= holeLocation && curHeight < holeLocation + holeSize) {
                    curHeight = holeLocation + holeSize;
                }
                this.pillars.create(x, curHeight, 'pillarTile');
            }
        };
        EventOne.prototype.randomIntFromInterval = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        // Update everything in the scene
        EventOne.prototype.update = function () {
            this.flea.update(this);
            if (!this.initialCutscene) {
                this.gameLoop();
            }
        };
        EventOne.prototype.startGame = function () {
            this.player.sprite.body.enable = true;
        };
        EventOne.prototype.gameLoop = function () {
            this.activePointer = this.game.input.activePointer;
            this.player.update(this);
            this.standingsRail.update(this);
            var playerScreenLocation = this.player.currentScreen;
            var desiredCameraLocation = playerScreenLocation * this.game.width;
            console.log(this.camera.x, this.camera.y);
            if (this.player.changedScreens) {
                this.cameraMoving = true;
            }
            // Need to handle if player goes back/respawning camera!
            if (this.cameraMoving) {
                this.game.camera.setPosition(this.game.camera.position.x + this.cameraMoveSpeed, this.worldDimensions.y - this.game.height);
                this.score.text = "" + (Math.floor(Math.random() * 10)) + "/" + this.numberOfScreens;
                if (this.player.currentScreen >= 9) {
                    this.score.text = (Math.floor(Math.random() * 10)) + this.score.text;
                }
                // Camera transition complete
                if (this.game.camera.position.x >= desiredCameraLocation) {
                    this.playerSpawnPoint.x = this.game.width * this.player.currentScreen + 150;
                    // dont need to set this every frame
                    this.game.world.setBounds(this.game.width, 0, this.worldDimensions.x - this.game.width, this.worldDimensions.y);
                    this.game.camera.setPosition(desiredCameraLocation, this.worldDimensions.y - this.game.height);
                    this.cameraMoving = false;
                    this.score.text = this.player.currentScreen + 1 + "/" + this.numberOfScreens;
                }
            }
        };
        EventOne.prototype.render = function () {
            this.graphics.clear();
            this.player.render(this.graphics);
        };
        return EventOne;
    }());
    exports.EventOne = EventOne;
});
define("app", ["require", "exports", "Event1/EventOne"], function (require, exports, EventOne_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onload = function () {
        console.log("ON LOADING!");
        var game = new EventOne_1.EventOne();
    };
});
//# sourceMappingURL=main.js.map