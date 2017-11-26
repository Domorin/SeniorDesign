import { ChargeMeter } from './chargeMeter';

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


    update(scene: GameScene) {
        var game: Phaser.Game = scene.game;        

        //  Collide the player with the platforms
        var hitPlatform = game.physics.arcade.collide(this.sprite, scene.collisionObjects);

        // If players feet are touching the floor, set X velocity to 0
        if (this.sprite.body.touching.down) {
            this.sprite.body.velocity.x = 0;
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
