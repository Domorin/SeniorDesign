import { ChargeMeter } from './chargeMeter';
import { EventOne } from "./EventOne";

export class Player implements IUpdatable, IRenderable {

    constructor(sprite: Phaser.Sprite) {
        console.log("Creating player!");
        this.sprite = sprite;
        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = 300;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.stopVelocityOnCollide = true;

        this.sprite.inputEnabled = true;

        this.chargeMeter = new ChargeMeter(this);

        this.sprite.events.onInputDown.add((s) =>
            this.playerClicked(s)
        );  

        this.finishedSignal = new Phaser.Signal();
    }

    // Constants
    VELOCITY_MODIFIER: number = 5;
    MAX_DRAG_DISTANCE: number = 125;
    GRAVITY: number = 300;
    RECT_WIDTH: number = 7;


    sprite: Phaser.Sprite;
    pointer: Phaser.Pointer;
    chargeMeter: ChargeMeter;
    beingDragged: boolean = false;
    onGround: boolean = true;

    finishedSignal: Phaser.Signal;

    currentScreen: number = 1;
    changedScreens: boolean = false;


    update(scene: GameScene) {
        var myScene: EventOne = scene as EventOne;

        var prevScreen = this.currentScreen;
        this.currentScreen = Math.floor(this.sprite.position.x / myScene.game.width);
        if (prevScreen != this.currentScreen) {
            this.changedScreens = true;
            if (this.currentScreen == myScene.numberOfScreens + 1) {
                this.finishedSignal.dispatch();
            }
        } else {
            this.changedScreens = false;
        }

        console.log("UPDATING!");

        //  Collide the player with the platforms and pillars
        var hitPlatform: boolean = myScene.game.physics.arcade.collide(this.sprite, myScene.ground);
        var hitPillar: boolean = myScene.game.physics.arcade.collide(this.sprite, myScene.pillars);
        if (hitPillar) {
            this.sprite.position.x = myScene.playerSpawnPoint.x;
            this.sprite.position.y = myScene.playerSpawnPoint.y;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
        }        

        // If players feet are touching the floor, set X velocity to 0
        if (hitPlatform) {
            this.hitPlatform();
        } else {
            this.onGround = false;
        }
        // Don't allow any charging if camera is moving
        if (!myScene.cameraMoving) {
            this.sprite.body.enable = true;
            this.chargeMeter.update(scene);
        } else { // Disable movement if camera is moving
            this.sprite.body.enable = false;
        }
    }

    hitPlatform() {
        console.log("hello?");
        this.sprite.body.velocity.x = 0;
        this.onGround = true;
    }

    playerClicked(s) {
        if (this.onGround) {
            this.beingDragged = true;
        }
    }

    render(graphics: Phaser.Graphics) {
        this.chargeMeter.render(graphics);
    }
}
