class preloader extends Phaser.Scene {
  constructor() {
    super("boot");
  }
  preload() {
    this.load.atlas("locke", "./assets/images/locke.png", "./assets/json/locke.json");
    this.load.image("tileset", "./assets/images/tile.png");
    this.load.atlas("tide", "./assets/images/tide.png", "./assets/json/tide.json");
    this.load.image("knife1", "./assets/images/knife1.png");
    this.load.tilemapTiledJSON("tutorial", "./assets/json/tutorial.json");
    this.load.audio("swosh", "./assets/audio/swosh.mp3");
    this.load.audio("stick", "./assets/audio/stick.mp3");
	}

  create() {
    this.anims.create({
      key: "throw",
      frameRate: 2,
      frames: [{key:"locke", frame:"0"}, {key:"locke", frame:"1"}, {key:"locke", frame:"2"}, {key:"locke", frame:"3"}, {key:"locke", frame:"4"}, {key:"locke", frame:"5"}, {key:"locke", frame:"6"}, {key:"locke", frame:"6"}, {key:"locke", frame:"2"}, {key:"locke", frame:"1"}, {key:"locke", frame:"0"}],
      repeat: 0
    });
    this.anims.create({
      key: "tide",
      frameRate: .75,
      frames: [{key:"tide", frame:"0"}, {key:"tide", frame:"1"}],
      repeat: -1
    })
    this.scene.start("tutorial");
  }
}
