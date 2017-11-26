interface GameScene {

    collisionObjects: Phaser.Group;
    game: Phaser.Game;

    preload: () => void
    create: () => void
    update: () => void
    render: () => void
}