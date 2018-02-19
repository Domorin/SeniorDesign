import { EventOne } from "./EventOne";

export class StandingsRail implements IUpdatable {

    constructor(game: Phaser.Game, playerKey: string, fleaKey: string, tileSpriteKey: string) {
        this.game = game;
        this.tileSpriteKey = tileSpriteKey;

        this.createRail(this.game, this.tileSpriteKey, playerKey, fleaKey);
        this.setVisible(false);
    }

    createRail(game: Phaser.Game, tileSpriteKey: string, playerKey: string, fleaKey: string) {
        this.tileWidth = game.cache.getImage(tileSpriteKey).width;
        this.tileHeight = game.cache.getImage(tileSpriteKey).height;

        this.numOfTiles = Math.floor((game.width - this.HORIZONTAL_BUFFER * 2) / this.tileWidth);

        this.railLength = this.tileWidth * this.numOfTiles;

        this.railTiles = game.add.group();

        var y = game.height - this.VERTICAL_BUFFER - this.tileHeight / 2;
        var x = this.HORIZONTAL_BUFFER;
        for (var i = 0; i < this.numOfTiles; i++) {
            var curSprite: Phaser.Sprite = game.add.sprite(x, y, tileSpriteKey);
            this.railTiles.add(curSprite);
            curSprite.fixedToCamera = true;
            x += this.tileWidth;
        }

        this.fleaHead = game.add.sprite(0, 0, fleaKey);
        this.fleaHead.x = this.HORIZONTAL_BUFFER - this.fleaHead.width / 2;
        this.fleaHead.y = game.height - this.VERTICAL_BUFFER - this.tileHeight / 2 - this.fleaHead.height * 1/2;
        this.fleaHead.fixedToCamera = true;

        this.playerHead = game.add.sprite(0, 0, playerKey);
        this.playerHead.x = this.HORIZONTAL_BUFFER - this.playerHead.width / 2;
        this.playerHead.y = game.height - this.VERTICAL_BUFFER - this.tileHeight / 2 - this.playerHead.height * 1/2;
        this.playerHead.fixedToCamera = true;
    }


    setVisible(visibility: boolean) {
        
        this.railTiles.setAll("visible", visibility);
        this.fleaHead.visible = visibility;
        this.playerHead.visible = visibility;
    }

    game: Phaser.Game;

    HORIZONTAL_BUFFER: number = 64;
    VERTICAL_BUFFER: number = 64;

    playerHead: Phaser.Sprite;
    fleaHead: Phaser.Sprite;
    tileSpriteKey: string;
    tileWidth: number;
    tileHeight: number;
    railLength: number;
    numOfTiles: number;

    railTiles: Phaser.Group;



    update(scene: GameScene) {
        var myScene: EventOne = scene as EventOne;

        var playerProgressRatio = myScene.player.sprite.x / myScene.worldDimensions.x;
        this.playerHead.cameraOffset.x = this.HORIZONTAL_BUFFER - this.playerHead.width / 2 + playerProgressRatio * this.railLength;


        var fleaProgressRatio = myScene.flea.sprite.x / myScene.worldDimensions.x;
        this.fleaHead.cameraOffset.x = this.HORIZONTAL_BUFFER - this.fleaHead.width / 2 + fleaProgressRatio * this.railLength;
    }
}