interface GameScene {

    collisionObjects: Phaser.Group;
    activePointer: Phaser.Pointer;
    game: Phaser.Game;

    preload: () => void
    create: () => void
    update: () => void
    render: () => void
}