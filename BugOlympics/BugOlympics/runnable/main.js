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
            this.currentScreen = 0;
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
            //  Collide the player with the platforms and pillars
            var hitPlatform = myScene.game.physics.arcade.collide(this.sprite, myScene.ground);
            var hitPillar = myScene.game.physics.arcade.collide(this.sprite, myScene.pillars);
            if (hitPillar) {
                this.sprite.position.x = myScene.spawnPoint.x;
                this.sprite.position.y = myScene.spawnPoint.y;
                this.sprite.body.velocity.x = 0;
                this.sprite.body.velocity.y = 0;
            }
            // If players feet are touching the floor, set X velocity to 0
            if (hitPlatform) {
                this.sprite.body.velocity.x = 0;
                this.onGround = true;
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
/// <reference path="Player.ts" />
define("Event1/EventOne", ["require", "exports", "Event1/Player"], function (require, exports, Player_1) {
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
            this.game.load.spritesheet('dude', 'content/dude.png', 32, 48);
        };
        EventOne.prototype.create = function () {
            console.log("Creating!");
            this.pillarMaxSpawnX = this.game.width * 9 / 10;
            this.pillarMinSpawnX = this.game.width / 2;
            this.pillarMaxHoleSize = 300;
            this.pillarMinHoleSize = 100;
            this.pillarMinHoleY = 150;
            this.pillarMaxHoleY = this.game.height - this.pillarMaxHoleSize - 40;
            this.numberOfScreens = 30;
            //  Use Arcade Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.worldDimensions = new Phaser.Point(this.game.width * (this.numberOfScreens), this.game.height);
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
            this.spawnPoint = new Phaser.Point(150, this.game.world.height - 128 - this.game.cache.getImage('dude').height - 5);
            var playerSprite = this.game.add.sprite(150, this.spawnPoint.y, 'dude', 8);
            //  We need to enable physics on the player
            this.game.physics.arcade.enable(playerSprite);
            this.player = new Player_1.Player(playerSprite);
            this.game.camera.bounds = new Phaser.Rectangle(0, 0, this.worldDimensions.x, this.worldDimensions.y);
            this.cameraMoving = false;
            this.cameraMoveSpeed = 20;
            this.graphics = this.game.add.graphics(0, 0);
            var style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
            this.score = this.game.add.text(this.game.width - 55, 5, "1/" + this.numberOfScreens, style);
            this.score.fixedToCamera = true;
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
            for (var curHeight = 0; curHeight < this.worldDimensions.y; curHeight += pillarTileHeight) {
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
            this.activePointer = this.game.input.activePointer;
            this.player.update(this);
            var playerScreenLocation = this.player.currentScreen;
            var desiredCameraLocation = playerScreenLocation * this.game.width;
            if (this.player.changedScreens) {
                this.cameraMoving = true;
            }
            // Need to handle if player goes back/respawning camera!
            if (this.cameraMoving) {
                this.game.camera.setPosition(this.game.camera.position.x + this.cameraMoveSpeed, 0);
                this.score.text = "" + (Math.floor(Math.random() * 10)) + "/" + this.numberOfScreens;
                if (this.player.currentScreen >= 9) {
                    this.score.text = (Math.floor(Math.random() * 10)) + this.score.text;
                }
                console.log(this.score.text);
                // Camera transition complete
                if (this.game.camera.position.x >= desiredCameraLocation) {
                    this.game.world.setBounds(desiredCameraLocation, 0, this.worldDimensions.x, this.worldDimensions.y);
                    this.spawnPoint.add(this.game.width, 0);
                    this.game.camera.setPosition(desiredCameraLocation, 0);
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