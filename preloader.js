class preloader extends Phaser.Scene {
  constructor() {
    super("boot");
  }
  preload() {
    this.load.atlas("locke", "./assets/images/locke.png", "./assets/json/locke.json");
    this.load.image("tileset", "./assets/images/tile.png");
    this.load.atlas("tide", "./assets/images/tide.png", "./assets/json/tide.json");
    this.load.image("knife1", "./assets/images/knife1.png");
    this.load.audio("swosh", "./assets/audio/swosh.mp3");
    this.load.audio("stick", "./assets/audio/stick.mp3");
    this.load.audio("blop", "./assets/audio/blop.mp3");
    this.load.audio("seaAmbiance", "./assets/audio/seaAmbiance.mp3");
    
    this.load.tilemapTiledJSON("tutorial", "./assets/json/tutorial.json");
    this.load.tilemapTiledJSON("1", "./assets/json/levels/level1.json");
    this.load.tilemapTiledJSON("2", "./assets/json/levels/level2.json");
    this.load.tilemapTiledJSON("3", "./assets/json/levels/level3.json");
    this.load.tilemapTiledJSON("4", "./assets/json/levels/level4.json");
    this.load.tilemapTiledJSON("5", "./assets/json/levels/level5.json");
    this.load.tilemapTiledJSON("6", "./assets/json/levels/level6.json");
    this.load.tilemapTiledJSON("7", "./assets/json/levels/level7.json");
    this.load.tilemapTiledJSON("8", "./assets/json/levels/level8.json");
    this.load.tilemapTiledJSON("9", "./assets/json/levels/level9.json");
    this.load.tilemapTiledJSON("10", "./assets/json/levels/level10.json");
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
      frameRate: .5,
      frames: [{key:"tide", frame:"0"}, {key:"tide", frame:"1"}],
      repeat: -1
    })
    if(localStorage.getItem("knife") == undefined)
      localStorage.setItem("knife", 1)
    if (localStorage.getItem("lastLevel") == undefined)
      localStorage.setItem("lastLevel", 0);
    this.scene.start("menu");
  }
}
