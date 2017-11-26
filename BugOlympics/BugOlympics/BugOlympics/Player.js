"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chargeMeter_1 = require("./chargeMeter");
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
//# sourceMappingURL=Player.js.map