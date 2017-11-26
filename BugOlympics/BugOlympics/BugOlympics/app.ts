﻿import { Player } from './Player';

class EventOne implements GameScene {

    constructor() {
        this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'content', { preload: this.preload, create: this.create, update: this.update, render: this.render });
    }

    game: Phaser.Game;
    graphics: Phaser.Graphics;
    collisionObjects: Phaser.Group;


    player: Player;
    pointer: Phaser.Pointer;

    playerBeingDragged: boolean = false;

    preload() {

        this.game.load.image('sky', 'content/sky.png');
        this.game.load.image('ground', 'content/platform.png');
        this.game.load.image('star', 'content/star.png');
        this.game.load.spritesheet('dude', 'content/dude.png', 32, 48);
    }

    create() {
        console.log("Creating!")
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
        this.player = new Player(playerSprite);        
        //  We need to enable physics on the player
        this.game.physics.arcade.enable(playerSprite);      

        this.graphics = this.game.add.graphics(0, 0);        
    }

    update() {
        this.player.update(this);
    }

    render() {
        this.graphics.clear()
        this.player.render(this.graphics);        
}

}

window.onload = () => {

    var game = new EventOne();

};