import { ChargeMeter } from './chargeMeter';
import { EventOne } from "./EventOne";

export class Player implements IUpdatable, IRenderable {

    constructor(sprite: Phaser.Sprite) {
        console.log("Creating player!");
        this.sprite = sprite;
        this.sprite.body.bounce.y = 0.2;
        this.sprite.body.gravity.y = 300;
        this.sprite.body.collideWorldBounds = false;
        this.sprite.body.stopVelocityOnCollide = true;

        this.sprite.inputEnabled = true;

        this.chargeMeter = new ChargeMeter(this);

        this.sprite.events.onInputDown.add((s) =>
            this.playerClicked(s)
        );  
    }

    // Constants
    VELOCITY_MODIFIER: number = 4;
    MAX_DRAG_DISTANCE: number = 125;
    GRAVITY: number = 300;
    RECT_WIDTH: number = 7;


    sprite: Phaser.Sprite;
    pointer: Phaser.Pointer;
    chargeMeter: ChargeMeter;
    beingDragged: boolean = false;
    onGround: boolean = true;


    update(scene: GameScene) {
        var myScene: EventOne = scene as EventOne;
        

        //  Collide the player with the platforms and pillars
        var hitPlatform: boolean = myScene.game.physics.arcade.collide(this.sprite, myScene.ground);
        var hitPillar: boolean = myScene.game.physics.arcade.collide(this.sprite, myScene.pillars);
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
        } else {
            this.onGround = false;
        }

        this.chargeMeter.update(scene);
        
    }

    playerClicked(s) {
        this.beingDragged = true;
    }

    render(graphics: Phaser.Graphics) {
        this.chargeMeter.render(graphics);
    }
}
