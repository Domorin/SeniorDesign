interface GameScene {

    ground: Phaser.Group;
    activePointer: Phaser.Pointer;
    game: Phaser.Game;

    preload: () => void
    create: () => void
    update: () => void
    render: () => void
}