define("chargeMeter", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ChargeMeter = (function () {
        function ChargeMeter(player) {
            this.RECT_WIDTH = 7;
            this.maxPower = false;
            this.player = player;
        }
        ChargeMeter.prototype.update = function (scene) {
            if (this.player.beingDragged) {
                // Calculate distance between player and pointer
                var dragDistance = Math.sqrt(Math.pow((this.pointer.y - this.player.sprite.body.center.y), 2) + Math.pow((this.pointer.x - this.player.sprite.body.center.x), 2));
                // Ensure distance is no greater than MAX_DRAG_DISTANCE
                if (dragDistance > this.player.MAX_DRAG_DISTANCE) {
                    dragDistance = this.player.MAX_DRAG_DISTANCE;
                    this.maxPower = true;
                }
                else {
                    this.maxPower = false;
                }
                // Get angle between the center of the player and the pointer
                var angle = -Math.atan2(this.pointer.y - this.player.sprite.body.center.y, this.pointer.x - this.player.sprite.body.center.x) + Math.PI;
                // Calculate and set the polygon points for the launch meter
                this.calculatePolygonPoints(dragDistance, angle);
                // Input was released, launch the player!
                if (this.pointer.isUp) {
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
define("Player", ["require", "exports", "chargeMeter"], function (require, exports, chargeMeter_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function () {
        function Player(sprite) {
            var _this = this;
            // Constants
            this.VELOCITY_MODIFIER = 4;
            this.MAX_DRAG_DISTANCE = 125;
            this.GRAVITY = 300;
            this.RECT_WIDTH = 7;
            this.beingDragged = false;
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
            var game = scene.game;
            //  Collide the player with the platforms
            var hitPlatform = game.physics.arcade.collide(this.sprite, scene.collisionObjects);
            // If players feet are touching the floor, set X velocity to 0
            if (this.sprite.body.touching.down) {
                this.sprite.body.velocity.x = 0;
            }
            this.chargeMeter.update(scene);
        };
        Player.prototype.playerClicked = function (s) {
            this.beingDragged = true;
        };
        Player.prototype.render = function (graphics) {
            this.chargeMeter.render(graphics);
        };
        return Player;
    }());
    exports.Player = Player;
});
/// <reference path="Player.ts" />
define("EventOne", ["require", "exports", "Player"], function (require, exports, Player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var EventOne = (function () {
        function EventOne() {
            this.playerBeingDragged = false;
            console.log("HELLO!!");
            this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
        }
        EventOne.prototype.preload = function () {
            this.game.load.image('sky', 'content/sky.png');
            this.game.load.image('ground', 'content/platform.png');
            this.game.load.image('star', 'content/star.png');
            this.game.load.spritesheet('dude', 'content/dude.png', 32, 48);
        };
        EventOne.prototype.create = function () {
            console.log("Creating!");
            //  Use Arcade Physics
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            //  A simple background for our game
            this.game.add.sprite(0, 0, 'sky');
            //  The platforms group contains the ground and the 2 ledges we can jump on
            this.collisionObjects = this.game.add.group();
            //  We will enable physics for any object that is created in this group
            this.collisionObjects.enableBody = true;
            // Here we create the ground.
            var ground = this.collisionObjects.create(0, this.game.world.height - 128, 'ground');
            //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
            ground.scale.setTo(2, 4);
            //  Creating ledges
            this.collisionObjects.create(450, 400, 'ground');
            this.collisionObjects.create(-150, 300, 'ground');
            this.collisionObjects.create(450, 150, 'ground');
            //  Set the immovable property for all objects in the platforms group.
            this.collisionObjects.setAll('body.immovable', true);
            var playerSprite = this.game.add.sprite(150, this.game.world.height - 250, 'dude');
            this.player = new Player_1.Player(playerSprite);
            //  We need to enable physics on the player
            this.game.physics.arcade.enable(playerSprite);
            this.graphics = this.game.add.graphics(0, 0);
        };
        EventOne.prototype.update = function () {
            this.player.update(this);
        };
        EventOne.prototype.render = function () {
            this.graphics.clear();
            this.player.render(this.graphics);
        };
        return EventOne;
    }());
    exports.EventOne = EventOne;
});
define("app", ["require", "exports", "EventOne"], function (require, exports, EventOne_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    window.onload = function () {
        console.log("ON LOADING!");
        var game = new EventOne_1.EventOne();
    };
});
//# sourceMappingURL=main.js.map