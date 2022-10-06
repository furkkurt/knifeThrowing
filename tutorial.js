class scene extends Phaser.Scene{
  constructor(){
    super("tutorial")
  }
  create(){
    //Create Tile Map
    this.map = this.make.tilemap({
      key: "tutorial",
      tileWidth: 16,
      tileHeight: 16
    });
    this.tileSet = this.map.addTilesetImage("tileset", "tileset");

    this.groundLayer = this.map.createLayer("groundLayer", this.tileSet);
    this.groundLayer.setCollisionByExclusion([-1]).setDepth(1.1);
    this.logLayer = this.map.createLayer("logLayer", this.tileSet).setDepth(1.2);
    this.logLayer.setCollisionByExclusion([-1]);
    this.bgLayer = this.map.createLayer("bgLayer", this.tileSet);

    //Create John Locke
    this.player = this.physics.add.sprite(3*16, 5*16,"locke").setDepth(1.2).setOrigin(0);
    this.knife = this.physics.add.sprite(this.player.x+17, this.player.y+22, "knife1").setScale(.25).setDepth(1.15);
    this.knife.setGravity(0);
    this.physics.add.collider(this.player, this.groundLayer);

    //Create tides
    for (let i=0; i<(this.bgLayer.width/16); i++){
      eval("this.add.sprite("+i*16+", 5.25*16, 'tide').play('tide').setOrigin(0)");
    }

    //Camera
    this.cameras.main.setZoom(6);
    this.cameras.main.startFollow(this.player);
    
    //Knife Rotation Event
    this.rotateKnife = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.knife.rotation += .7;
      },loop: true, paused: true
    });

    //Stick
    this.physics.add.collider(this.knife, this.logLayer, () => {
      this.sound.play("stick");
      this.rotateKnife.paused = true;
      this.knife.x += 5;
    });
    this.throw();
  }
  throw(){
    this.player.play("throw")
    this.time.addEvent({
      delay: 1500,
      callback:() =>{
        this.knife.setRotation(-1.5);
        this.knife.y -= 8;
        this.time.addEvent({
          delay: 500,
          callback:() =>{
            this.knife.setRotation(-3);
            this.knife.y -= 6;
            this.knife.x -= 10;
            this.time.addEvent({
              delay: 500,
              callback:() =>{
                this.knife.setRotation(-4.5);
                this.knife.x -= 8;
                this.time.addEvent({
                  delay: 500,
                  callback:() =>{
                    this.sound.play("swosh");
                    this.cameras.main.startFollow(this.knife);
                    this.knife.setVelocityX(200);
                    this.rotateKnife.paused = false;
                  }
                })
              }
            })
          }
        })
      }
    });
  }
}

