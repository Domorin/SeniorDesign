/// <reference path="Player.ts" />

import { Player } from "./Player";

export class EventOne implements GameScene {


    camera: Phaser.Camera;
    game: Phaser.Game;
    graphics: Phaser.Graphics;
    ground: Phaser.Group;
    groundHeight: number;
    player: Player;
    activePointer: Phaser.Pointer;

    score: Phaser.Text;


    worldDimensions: Phaser.Point;

    pillars: Phaser.Group;

    spawnPoint: Phaser.Point;

    pillarMaxSpawnX: number;
    pillarMinSpawnX: number;

    pillarMaxHoleSize: number;
    pillarMinHoleSize: number;

    pillarMinHoleY: number;
    pillarMaxHoleY: number;

    numberOfScreens: number;

    cameraMoving: boolean;
    cameraMoveSpeed: number;

    constructor() {
        this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'content', this);
    }

    preload() {
        this.game.load.image('pillarTile', 'content/pillarTile.png');
        this.game.load.image('sky', 'content/sky.png');
        this.game.load.image('ground', 'content/platform.png');
        this.game.load.spritesheet('dude', 'content/dude.png', 32, 48);
    }

    create() {
        console.log("Creating!")

        this.pillarMaxSpawnX = this.game.width * 9/10;
        this.pillarMinSpawnX = this.game.width / 2;

        this.pillarMaxHoleSize = 300;
        this.pillarMinHoleSize = 100;

        this.pillarMinHoleY = 150
        this.pillarMaxHoleY = this.game.height - this.pillarMaxHoleSize - 40;

        this.numberOfScreens = 30;


        //  Use Arcade Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.worldDimensions = new Phaser.Point(this.game.width * (this.numberOfScreens), this.game.height);
        this.game.world.setBounds(0, 0, this.worldDimensions.x, this.worldDimensions.y);

        var pillarTileHeight = this.game.cache.getImage("pillarTile").height;

        //  A simple background for our game
        var backgroundWidth = this.game.cache.getImage("sky").width
        var backgroundHeight = this.game.cache.getImage("sky").height;        
        // Adding the mutliple background images to fit the world space if needed
        // We could just scale the ground texture instead, but it would look ugly it wasn't just a solid color
        for (var x = 0; x < this.worldDimensions.x; x += backgroundWidth) {
            var curSprite: Phaser.Sprite = this.game.add.sprite(x, 0, 'sky');
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
        this.player = new Player(playerSprite);

        this.game.camera.bounds = new Phaser.Rectangle(0, 0, this.worldDimensions.x, this.worldDimensions.y);
        this.cameraMoving = false;
        this.cameraMoveSpeed = 20;
        
        this.graphics = this.game.add.graphics(0, 0);

        var style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.score = this.game.add.text(this.game.width - 55, 5, "1/" + this.numberOfScreens, style);
        this.score.fixedToCamera = true;

    }

    createPillars(pillarTileHeight: number) {
        // Do not have a pillar on the last screen
        for (var i = 0; i < this.numberOfScreens-1; i++) {
            var x = this.randomIntFromInterval(this.pillarMinSpawnX, this.pillarMaxSpawnX) + (i * this.game.width);
            var holeY = this.randomIntFromInterval(this.pillarMinHoleY, this.pillarMaxHoleY);
            var holeSize = this.randomIntFromInterval(this.pillarMinHoleSize, this.pillarMaxHoleSize);
            console.log("Creating Pillar:")
            console.log("X: ", x);
            console.log("Hole Y:", holeY);
            console.log("Hole Size:", holeSize);
            this.createPillar(x, holeY, holeSize, pillarTileHeight);
        }
    }


    createPillar(x: number, holeY: number, holeSize: number, pillarTileHeight: number) {
        for (var curHeight = 0; curHeight < this.worldDimensions.y; curHeight += pillarTileHeight) {
            var holeLocation = this.worldDimensions.y - holeY - holeSize;
            if (curHeight >= holeLocation && curHeight < holeLocation + holeSize) {
                curHeight = holeLocation + holeSize;
            }
            this.pillars.create(x, curHeight, 'pillarTile');
        }
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    // Update everything in the scene
    update() {
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
    }

    render() {
        this.graphics.clear()
        this.player.render(this.graphics);
}

}
