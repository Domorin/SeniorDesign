import { Utils } from "Utils";

export class Flea implements IUpdatable, IRenderable {

    constructor(sprite: Phaser.Sprite, timer: Phaser.Timer, leapDistance: number) {
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

        this.LEAP_DISTANCE = leapDistance;
        
    }

    cutsceneEndedSignal: Phaser.Signal;

    initialCutscene: boolean;

    sprite: Phaser.Sprite;
    onGround: boolean;
    leaping: boolean;

    GRAVITY: number = 300;
    INITIAL_HOPS: number = 5;
    HOP_MIN_VELOCITY: number = 125;
    HOP_MAX_VELOCITY: number = 75
    HOP_DELAY: number = 1000;
    currentHops: number = 0;

    LEAP_DISTANCE: number;

    X_LEAP_VELOCITY: number = 200;

    timer: Phaser.Timer;

    startHop() {
        this.currentHops = 0;

        console.log("STARITNG HOP!!");
        this.timer.start();
        this.timer.add(this.HOP_DELAY, this.hop, this);
    }

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
        this.leaping = true;

        var time: number = this.LEAP_DISTANCE / this.X_LEAP_VELOCITY;
        var yVelocity: number = 1 / 2 * time * -this.GRAVITY;
        this.sprite.body.velocity.y = yVelocity;
        this.sprite.body.velocity.x = this.X_LEAP_VELOCITY;
    }


    hitPlatform() {        
        this.onGround = true;
        this.sprite.body.velocity.x = 0;

        if (this.leaping) {
            this.cutsceneEndedSignal.dispatch();

            this.leaping = false;
            this.startHop();
        }
    }

    render: (graphics: Phaser.Graphics) => void;

    update(scene: GameScene) {
        var fleaCollided: boolean = scene.game.physics.arcade.collide(this.sprite, scene.ground, this.hitPlatform, null, this);
    }

}