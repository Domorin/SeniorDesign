import { Utils } from "Utils";

export class Flea implements IUpdatable, IRenderable {

    constructor(sprite: Phaser.Sprite, timer: Phaser.Timer) {
        this.sprite = sprite;
        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = this.GRAVITY;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.stopVelocityOnCollide = true;

        this.onGround = true;

        this.timer = timer;

        this.timer.add(this.HOP_DELAY, this.hop, this);
        this.timer.start();
    }

    sprite: Phaser.Sprite;
    onGround: boolean;

    GRAVITY: number = 300;
    INITIAL_HOPS: number = 5;
    HOP_MIN_VELOCITY: number = 125;
    HOP_MAX_VELOCITY: number = 75
    HOP_DELAY: number = 1000;
    currentHops: number = 0;

    X_LEAP_VELOCITY: number = 200;

    timer: Phaser.Timer;

    hop() {
        this.currentHops++;
        var hopVelocity: number = Utils.randomIntFromInterval(this.HOP_MIN_VELOCITY, this.HOP_MAX_VELOCITY);
        this.sprite.body.velocity.y = -hopVelocity;
        var hopInterval: number = 2 * hopVelocity / this.GRAVITY * 1000;
        var funcToAdd = this.hop;
        if (this.currentHops >= this.INITIAL_HOPS) {
            funcToAdd = this.leap;
        }
        this.timer.add(hopInterval, funcToAdd, this);

    }

    leap() {
        var time: number = 1024 / this.X_LEAP_VELOCITY;
        var yVelocity: number = 1 / 2 * time * -this.GRAVITY;
        this.sprite.body.velocity.y = yVelocity;
        this.sprite.body.velocity.x = this.X_LEAP_VELOCITY;
    }


    hitPlatform() {        
        this.onGround = true;
        this.sprite.body.velocity.x = 0;
    }

    render: (graphics: Phaser.Graphics) => void;

    update: (scene: GameScene) => void;

}