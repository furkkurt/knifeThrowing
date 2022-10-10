class level extends Phaser.Scene{
  constructor(){
    super("level")
  }
  create(){
    if(localStorage.getItem("currentLevel") == undefined)
      localStorage.setItem("currentLevel", localStorage.getItem("lastLevel"));
    //Create tilemap and layers
    this.map = this.make.tilemap({
      key: localStorage.getItem("currentLevel"),
      tileWidth: 16,
      tileHeight: 16
    });
    this.tileSet = this.map.addTilesetImage("tileset", "tileset");
  
    //Create layers
    this.groundLayer = this.map.createLayer("groundLayer", this.tileSet);
    this.groundLayer.setCollisionByExclusion([-1]).setDepth(1.1);
    this.logLayer = this.map.createLayer("logLayer", this.tileSet).setDepth(1.2);
    this.logLayer.setCollisionByExclusion([-1]);
    this.bgLayer = this.map.createLayer("bgLayer", this.tileSet);

    //Player
    this.player = this.physics.add.sprite(3*16, (this.map.height-5)*16,"locke").setDepth(1.2).setOrigin(0);
    this.physics.add.collider(this.player, this.groundLayer);

    //Get knife from local storage
    this.knife = this.physics.add.sprite(this.player.x+17, this.player.y+22, "knife"+localStorage.getItem("knife")).setScale(.25).setDepth(1.15);
    this.knife.setGravity(0);
    this.knife.setBounce(1);
    
    //Set weight by knife
    this.weights = [0.3, 0.5];
    this.weight = this.weights[localStorage.getItem("knife")];
    
    //Background audio
    this.sound.stopAll();
    this.sound.play("seaAmbiance", {loop: true, volume:.25});
    
    //Create tides
    for (let i=0; i<(this.bgLayer.width/16); i++){
      eval("this.add.sprite("+i*16+", (this.map.height-4.75)*16, 'tide').play('tide').setOrigin(0)");
    }

    //Camera
    this.cameras.main.startFollow(this.player); 
    this.cameras.main.setZoom(1.75);
    this.cameras.main.x -= 595;
    this.cameras.main.width = 1215;
    this.time.addEvent({delay: 1000,callback:() =>{
      this.time.addEvent({
        delay: 10,
        callback:() =>{
          this.cameras.main.zoom += .05
          this.cameras.main.x += 7;
          this.cameras.main.width -= 9
        }, repeat: 84
      })
    }})
    
    //Value texts
    this.rotSpeedText = this.add.text(220, 375, "Rotation Speed: " + this.rotSpeed).setDepth(1.4).setScale(.2).setScrollFactor(0);
    this.xSpeedText = this.add.text(220, 380, "X Axis Speed: " + this.xSpeed).setDepth(1.4).setScale(.2).setScrollFactor(0);
    this.ySpeedText = this.add.text(220,385,"Y Axis Speed: " + this.ySpeed).setDepth(1.4).setScale(.2).setScrollFactor(0);

    //Get values from player
    this.rotSpeed = this.xSpeed = this.ySpeed = 0;
    this.viusalValue = this.add.line(0,0,0,0,0,0,0x000000);
    this.setForces = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.viusalValue.destroy();
        this.viusalValue = this.add.line(0,0,game.input.activePointer.worldX*2,game.input.activePointer.worldY,this.knife.x, this.knife.y ,0x000000, .5).setDepth(1.5);
        this.xSpeed = ((this.player.x - game.input.activePointer.x)+82)*this.weight*8*(this.map.width/20);
        this.ySpeed = ((game.input.activePointer.y - this.player.y)-504)*this.weight*2*(this.map.height/10);
      }, loop: true, paused: true
    });
    this.increaseRotSpeed = this.time.addEvent({
      delay: this.weight*50,
      callback:() =>{
        if(this.viusalValue.strokeAlpha < 1){
          this.rotSpeed += .01;
          this.viusalValue.strokeAlpha += .01;
        }
      }, loop: true, paused: true
    });

    //Invisible interactive object
    this.screen = this.add.rectangle(0,0,450,900,"black").setOrigin(0).setInteractive().setScrollFactor(0).setDepth(2);
    this.screen.alpha = .01;
    //Pointer down (set x and y velocities and start increasing rotation speed value)
    this.screen.on("pointerdown", () => {
      if(!this.setForces.paused || this.viusalValue.strokeColor==0x000000){
        this.increaseRotSpeed.paused=true;
        this.setForces.paused = false;
      }
      else {
        this.increaseRotSpeed.paused = true;
        this.throw();
        this.screen.setVisible(false);
      }
    });
    //Pointer up (stop increasing rotation speed value and execute throw function)
    this.time.addEvent({delay: 250, callback:() =>{
      this.screen.on("pointerup", ()=>{
        this.setForces.paused = true;
        this.increaseRotSpeed.paused = false;
        this.viusalValue.strokeColor = 0xff0000;
        this.viusalValue.strokeAlpha = 0;
      });
    }})


    //Rotate knife
    this.rotateKnife = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.knife.rotation += this.rotSpeed;
      },loop: true, paused: true
    });
  
    //Knife dropping to gorund layer event
    this.blop = false
    this.physics.add.collider(this.knife, this.groundLayer, () => {
      if(this.blop = false){
        this.sound.play("blop")
        this.blop = true;
      }
      this.knife.setVelocity(0); 
      this.rotateKnife.paused = true;
      if(this.knife.rotation>2.3 || this.knife.rotation<-0.3){
        this.knife.rotation = 0;
      }
      this.time.addEvent({
        delay: 250,
        callback:() =>{
          this.cameras.main.startFollow(this.player);
          this.time.addEvent({
            delay: 500,
            callback:() =>{
              this.scene.start("level");
            }
          })
        }
      })
    });

    //Knife stabbing to tree event
    this.physics.add.collider(this.knife, this.logLayer, () => {
      this.knife.x += 5;
 
      if(this.knife.rotation<0.8 && this.knife.rotation>-1.4){
        this.rotateKnife.paused = true;
        this.knife.setVelocity(0);
        this.knife.setGravity(0);
        this.sound.play("stick");
        if(this.knife.rotation<.2 && this.knife.rotation>-.2){
          this.perfectText = this.add.text(188, 400, "PERFECT!", {color: "yellow"}).setScrollFactor(0).setDepth(1.5);
          this.time.addEvent({
            delay: 2000,
            callback:() =>{
              this.time.addEvent({
                delay: 20,
                callback:() =>{
                  this.perfectText.alpha -= .01;
                }, repeat: 100
              })
            }
          })
        };
        this.levelComplete.setVisible(true);
        this.levelCompleteFade.paused = false;
      } else {
        this.sound.play("blop");
      }
    });

    //Level Complete
    this.completeText1 = this.add.text(220, 420, "KACHOW!").setScrollFactor(0).setScale(.2).setDepth(1.5);
      //Replay current level
    this.completeText2 = this.add.text(200, 430, "PLAY AGAIN").setScrollFactor(0).setScale(.2).setDepth(1.5).setInteractive();
    this.completeText2.on("pointerdown", () => {
      this.time.addEvent({
        delay: 500,
        callback:() =>{
          this.scene.start("level")
        }
      })
    });
      //Start next level
    this.completeText3 = this.add.text(230, 430, "NEXT LEVEL").setScrollFactor(0).setScale(.2).setDepth(1.5).setInteractive();
    this.completeText3.on("pointerdown", () => {
      this.time.addEvent({
        delay: 500,
        callback:() =>{
          if(localStorage.getItem("lastLevel") == localStorage.getItem("currentLevel")){
            localStorage.setItem("lastLevel", parseInt(localStorage.getItem("lastLevel"))+1)
            localStorage.setItem("currentLevel", localStorage.getItem("lastLevel"));
          }
          else 
            localStorage.setItem("currentLevel", parseInt(localStorage.getItem("currentLevel"))+1);
          this.scene.start("level") 
        }
      })
    });
    this.levelComplete = this.add.group();
    this.levelComplete.add(this.completeText1);
    this.levelComplete.add(this.completeText2);
    this.levelComplete.add(this.completeText3);
    this.levelComplete.setVisible(false);
      //Black fade in on level completion
    this.levelCompleteBox = this.add.rectangle(0,0,600,1200, "black").setDepth(1.45).setScrollFactor(0);
    this.levelCompleteBox.alpha = 0;
    this.levelCompleteFade = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.levelCompleteBox.alpha += 0.01
      }, repeat: 100, paused: true
    })

  }
  update(){
    //Display values
    this.rotSpeedText.setText(this.rotSpeed.toFixed(2));
    this.xSpeedText.setText(this.xSpeed.toFixed(2));
    this.ySpeedText.setText(this.ySpeed.toFixed(2));

    //Restart level if knife gets out of borders
    if(this.knife.x<0 || this.knife.x>320)
      this.scene.start("level");
  }
  throw(){
    this.player.play("throw");
    this.viusalValue.setVisible(false);
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
                    this.knife.setVelocity(this.xSpeed, -this.ySpeed);
                    this.rotateKnife.paused = false;
                    this.knife.setGravityY(200);
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
