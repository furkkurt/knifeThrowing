var config = {
        type: Phaser.AUTO,
        width: 450,
        height: 900,
        scale: {
          mode: Phaser.Scale.FIT,
        },
        physics: {
            default: 'arcade',
					arcade: {debug: false}
        },
        scene:[preloader, scene],
        pixelArt: true,
    };

var game = new Phaser.Game(config);
