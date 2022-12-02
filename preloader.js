class preloader extends Phaser.Scene {
  constructor() {
    super("boot");
  }
  preload() {
    this.load.atlas("locke", "./assets/images/locke.png", "./assets/json/locke.json");
    this.load.image("tileset", "./assets/images/tile.png");
    this.load.atlas("tide", "./assets/images/tile.png", "./assets/json/tide.json");
    this.load.atlas("knife1", "./assets/images/tile.png", "./assets/json/knife1.json");
    this.load.atlas("knife2", "./assets/images/tile.png", "./assets/json/knife2.json");
    this.load.atlas("knife3", "./assets/images/tile.png", "./assets/json/knife3.json");
    this.load.atlas("knife4", "./assets/images/tile.png", "./assets/json/knife4.json");
    this.load.atlas("knife5", "./assets/images/tile.png", "./assets/json/knife5.json");
    this.load.atlas("knife6", "./assets/images/tile.png", "./assets/json/knife6.json");
    this.load.audio("swosh", "./assets/audio/swosh.mp3");
    this.load.audio("stick", "./assets/audio/stick.mp3");
    this.load.audio("blop", "./assets/audio/blop.mp3");
    this.load.audio("splash", "./assets/audio/splash.mp3");
    this.load.audio("seaAmbiance", "./assets/audio/seaAmbiance.mp3");
    this.load.atlas("ivy", "./assets/images/tile.png", "./assets/json/ivy.json");
    this.load.atlas("ivyVert", "./assets/images/tile.png", "./assets/json/ivyVert.json");
    this.load.tilemapTiledJSON("tutorial", "./assets/json/tutorial.json");
    this.load.atlas("waterfall", "./assets/images/tile.png", "./assets/json/waterfall.json");
    this.load.atlas("drops", "./assets/images/tile.png", "./assets/json/drops.json");
    this.load.atlas("apple", "./assets/images/tile.png", "./assets/json/apple.json");
    this.load.audio("apple", "./assets/audio/apple.mp3");
    this.load.image("shelf", "./assets/images/shelf.png");
    
    //preload all levels
    for(let i = 0; i<25; i++)
      eval("this.load.tilemapTiledJSON('"+(i+1)+"', './assets/json/levels/level"+(i+1)+".json')");
	}

  create() {
    this.anims.create({
      key: "throw",
      frameRate: 4,
      frames: [{key:"locke", frame:"0"}, {key:"locke", frame:"2"}, {key:"locke", frame:"3"}, {key:"locke", frame:"4"}, {key:"locke", frame:"5"}, {key:"locke", frame:"6"}, {key:"locke", frame:"6"}, {key:"locke", frame:"6"}, {key:"locke", frame:"6"}, {key:"locke", frame:"3"}, {key:"locke", frame:"0"}],
      repeat: 0
    });
    this.anims.create({
      key: "tide",
      frameRate: .5,
      frames: [{key:"tide", frame:"0"}, {key:"tide", frame:"1"}],
      repeat: -1
    });    
    this.anims.create({
      key: "ivyAnims",
      frameRate: 5,
      frames: [{key:"ivy", frame:"0"}, {key:"ivy", frame:"1"}, {key:"ivy", frame:"2"}, {key:"ivy", frame:"1"}, {key:"ivy", frame:"0"}],
      repeat: 0
    });    
    this.anims.create({
      key: "ivyVertAnims",
      frameRate: 10,
      frames: [{key:"ivyVert", frame:"0"}, {key:"ivyVert", frame:"1"}, {key:"ivyVert", frame:"2"}, {key:"ivyVert", frame:"1"}, {key:"ivyVert", frame:"0"}],
      repeat: 0
    });
    this.anims.create({
      key: "waterfallBody",
      frameRate: 8,
      frames: [{key:"waterfall", frame:"1"}, {key:"waterfall", frame:"2"}],
      repeat: -1
    });
    /*
    this.anims.create({key: "knife1",frameRate: 0,frames: [{key:"knife1", frame:"0"}],repeat: -1});
    this.anims.create({key: "knife2",frameRate: 0,frames: [{key:"knife2", frame:"0"}],repeat: -1});
    this.anims.create({key: "knife3",frameRate: 0,frames: [{key:"knife3", frame:"0"}],repeat: -1});
    this.anims.create({key: "knife4",frameRate: 0,frames: [{key:"knife4", frame:"0"}],repeat: -1});
    this.anims.create({key: "knife5",frameRate: 0,frames: [{key:"knife5", frame:"0"}],repeat: -1});
    this.anims.create({key: "knife6",frameRate: 0,frames: [{key:"knife6", frame:"0"}],repeat: -1});
    this.anims.create({key: "drops",frameRate: 0,frames: [{key:"drops", frame:"0"}],repeat: -1});
    this.anims.create({key: "apple",frameRate: 0,frames: [{key:"apple", frame:"0"}],repeat: -1});
    */
    if(localStorage.getItem("knife") == undefined)
      localStorage.setItem("knife", 1)
    if(localStorage.getItem("lastLevel") == undefined)
      localStorage.setItem("lastLevel", 25);
    this.scene.start("menu");
  }
}
