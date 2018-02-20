/// <reference path="Player.ts" />

import { Player } from "./Player";
import { Flea } from "./Flea";
import { StandingsRail } from "./StandingsRail";

export class EventOne implements GameScene {


    player: Player;
    flea: Flea;
    standingsRail: StandingsRail;

    camera: Phaser.Camera;
    game: Phaser.Game;
    graphics: Phaser.Graphics;
    ground: Phaser.Group;
    crowd: Phaser.Group;
    groundHeight: number;
    activePointer: Phaser.Pointer;

    initialCutscene: boolean;
    hasReachedEnd: boolean;

    score: Phaser.Text;
    endText: Phaser.Text;


    worldDimensions: Phaser.Point;

    pillars: Phaser.Group;

    playerSpawnPoint: Phaser.Point;
    fleaSpawnPoint: Phaser.Point;

    pillarMaxSpawnX: number;
    pillarMinSpawnX: number;

    pillarMaxHoleSize: number;
    pillarMinHoleSize: number;

    pillarMinHoleY: number;
    pillarMaxHoleY: number;

    numberOfScreens: number;

    cameraMoving: boolean;
    cameraMoveSpeed: number;

    PLATFORM_HEIGHT: number;

    constructor() {
        this.game = new Phaser.Game(1024, 768, Phaser.AUTO, 'content', this);
    }

    preload() {
        this.game.load.image('pillarTile', 'content/pillarTile.png');
        this.game.load.image('sky', 'content/sky.png');
        this.game.load.image('ground', 'content/grassBG2.png');
        this.game.load.image('flea', 'content/fleaStanding.png');
        this.game.load.image('standingsRail', 'content/trackTile.png');
        this.game.load.image('playerHead', 'content/playerHead.png');
        this.game.load.image('fleaHead', 'content/fleaHead.png');
        this.game.load.spritesheet('dude', 'content/dude.png', 32, 48);
        this.game.load.spritesheet('crowd', 'content/crowd.png', 505, 181);
    }

    create() {
        console.log("Creating!")

        this.PLATFORM_HEIGHT = 128;

        this.initialCutscene = true;

        this.pillarMaxSpawnX = this.game.width * 9/10;
        this.pillarMinSpawnX = this.game.width / 2;

        this.pillarMaxHoleSize = 300;
        this.pillarMinHoleSize = 100;

        this.pillarMinHoleY = 150
        this.pillarMaxHoleY = this.game.height - this.pillarMaxHoleSize - 40;

        this.numberOfScreens = 5;


        //  Use Arcade Physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.worldDimensions = new Phaser.Point(this.game.width * (this.numberOfScreens + 2), this.game.height * 3);
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

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.ground = this.game.add.group();

        //  We will enable physics for any object that is created in this group
        this.ground.enableBody = true;

        // Here we create the ground.
        var ground = this.ground.create(0, this.game.world.height - this.PLATFORM_HEIGHT, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(3 * this.numberOfScreens, 4);

        this.ground.visible = true;

        //  Set the immovable property for all objects in the platforms group.
        this.ground.setAll('body.immovable', true);

        this.createField();
        this.createCrowd();
        this.pillars = this.game.add.group();

        this.pillars.enableBody = true;
        this.createPillars(this.game.cache.getImage("pillarTile").height);
        this.pillars.setAll('body.immovable', true);  


        this.playerSpawnPoint = new Phaser.Point(150 + this.game.width, this.game.world.height - this.PLATFORM_HEIGHT - this.game.cache.getImage('dude').height - 5);
        this.fleaSpawnPoint = new Phaser.Point(this.playerSpawnPoint.x - 50 - this.game.width, this.playerSpawnPoint.y);

        var playerSprite = this.game.add.sprite(this.playerSpawnPoint.x, this.playerSpawnPoint.y, 'dude', 8); 
        //  We need to enable physics on the player
        this.game.physics.arcade.enable(playerSprite);
        this.player = new Player(playerSprite);

        this.createFlea();

        this.game.camera.bounds = new Phaser.Rectangle(0, 0, this.worldDimensions.x, this.worldDimensions.y);
        this.cameraMoving = false;
        this.cameraMoveSpeed = 20;

        this.camera.follow(this.flea.sprite);
        
        this.graphics = this.game.add.graphics(0, 0);

        var style = { font: "bold 20px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.score = this.game.add.text(this.game.width - 55, 5, "1/" + this.numberOfScreens, style);
        this.score.fixedToCamera = true;
        this.score.visible = false;

        var style2 = { font: "bold 40px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        this.endText = this.game.add.text(this.game.width / 2 - 40, this.game.height / 6, "You win!!");
        this.endText.fixedToCamera = true;
        this.endText.visible = false;

        this.player.sprite.body.enable = false;

        this.flea.cutsceneEndedSignal.add(this.endCutscene, this);
        this.player.finishedSignal.add(this.reachedEnd, this);
        this.hasReachedEnd = false;

        this.createStandingsRail();
    }

    createField() {
        var groundWidth = this.game.cache.getImage("ground").width;
        var groundHeight = this.game.cache.getImage("ground").height;
        for (var currentWidth = 0; currentWidth < this.worldDimensions.x; currentWidth += groundWidth) {
            this.game.add.sprite(currentWidth, this.game.world.height - 256, 'ground');
        }
    }

    createCrowd() {
        this.crowd = this.game.add.group();

        var crowdWidth = this.game.cache.getImage("crowd").width / 2;
        var crowdHeight = this.game.cache.getImage("crowd").height;
        var crowdPlacementY = this.game.world.height - this.game.cache.getImage("ground").height - crowdHeight;
        for (var currentWidth = 0; currentWidth < this.worldDimensions.x; currentWidth += crowdWidth) {
            var curSprite: Phaser.Sprite = this.crowd.create(currentWidth, crowdPlacementY, 'crowd');
            var anim: Phaser.Animation = curSprite.animations.add('excited');
            anim.play(this.randomIntFromInterval(1, 5), true, false);
        }
    }

    reachedEnd() {
        this.hasReachedEnd = true;
        this.endText.visible = true;
        this.score.visible = false;
        this.player.sprite.events.destroy();
    }


    endCutscene() {
        if (this.initialCutscene) {
            this.initialCutscene = false;
            this.player.sprite.body.enable = true;
            this.camera.unfollow();
            this.cameraMoving = true;
            this.standingsRail.setVisible(true);
            this.score.visible = true;
        }
    }

    createStandingsRail() {
        this.standingsRail = new StandingsRail(this.game, 'playerHead', 'fleaHead', 'standingsRail',);
    }

    createFlea() {
        var fleaSprite = this.game.add.sprite(this.fleaSpawnPoint.x, this.fleaSpawnPoint.y, 'flea');
        this.game.physics.arcade.enable(fleaSprite);
        this.flea = new Flea(fleaSprite, this.game.time.create(false));
    }

    createPillars(pillarTileHeight: number) {
        // Do not have a pillar on the last screen
        for (var i = 0; i < this.numberOfScreens+1; i++) {
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
        for (var curHeight = this.worldDimensions.y - this.game.height; curHeight < this.worldDimensions.y - this.PLATFORM_HEIGHT; curHeight += pillarTileHeight) {
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
        this.flea.update(this);
        if (!this.initialCutscene) {
            this.gameLoop();
        }
    }

    startGame() {
        this.player.sprite.body.enable = true;
    }

    gameLoop() {
        this.activePointer = this.game.input.activePointer;
        this.player.update(this);
        this.standingsRail.update(this);

        var playerScreenLocation = this.player.currentScreen;
        var desiredCameraLocation = playerScreenLocation * this.game.width;
        if (this.player.changedScreens) {
            this.cameraMoving = true;
        }

        // Need to handle if player goes back/respawning camera!
        if (this.cameraMoving) {
            this.game.camera.setPosition(this.game.camera.position.x + this.cameraMoveSpeed, this.worldDimensions.y - this.game.height);
            this.score.text = "" + (Math.floor(Math.random() * 10)) + "/" + this.numberOfScreens;
            if (this.player.currentScreen >= 9) {
                this.score.text = (Math.floor(Math.random() * 10)) + this.score.text;
            }
            // Camera transition complete
            if (this.game.camera.position.x >= desiredCameraLocation) {
                this.playerSpawnPoint.x = this.game.width * this.player.currentScreen + 150;
                // dont need to set this every frame
                console.log("CAMERA SET!!");
                this.game.world.setBounds(this.game.width, 0, this.worldDimensions.x - this.game.width, this.worldDimensions.y);
                this.game.camera.setPosition(desiredCameraLocation, this.worldDimensions.y - this.game.height);
                this.cameraMoving = false;

                this.score.text = this.player.currentScreen + "/" + this.numberOfScreens;
            }
        }
    }

    render() {
        this.graphics.clear()
        this.player.render(this.graphics);
}

}
