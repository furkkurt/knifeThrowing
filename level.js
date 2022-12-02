class level extends Phaser.Scene{
  constructor(){
    super("level")
  }
  create(){
    //Back to main menu
    if(localStorage.getItem("currentLevel") == undefined)
      localStorage.setItem("currentLevel", localStorage.getItem("lastLevel"));
    //Create tilemap
    this.map = this.make.tilemap({
      key: localStorage.getItem("currentLevel"),
      tileWidth: 16,
      tileHeight: 16
    });
    this.tileSet = this.map.addTilesetImage("tileset", "tileset");

    //get starting position
    this.startingPosition;
    if(parseInt(localStorage.getItem("currentLevel")) <= 10)
      this.startingPosition = this.map.height-5;
    else if(parseInt(localStorage.getItem("currentLevel")) > 10 && parseInt(localStorage.getItem("currentLevel")) <= 19)
      this.startingPosition = -2;
    else if(parseInt(localStorage.getItem("currentLevel")) > 19 && parseInt(localStorage.getItem("currentLevel")) <= 22)
      this.startingPosition = this.map.height-5;
    else if(parseInt(localStorage.getItem("currentLevel")) > 22 && parseInt(localStorage.getItem("currentLevel")) <= 29)
      this.startingPosition = -2;
  
    //Player
    this.player = this.physics.add.sprite(3*16, this.startingPosition*16,"locke").setDepth(1.2).setOrigin(0);
 
    //Set weight and scale by knife
    this.weights = [0.5, 0.52, 0.42, 0.44, 0.48, 0.46];
    this.scales = [.25, .2, .4, .26, .4, .45];
    this.startXs = [17, 17, 17, 17, 17, 17];
    this.startYs = [22, 22, 19, 23, 18, 18];
    this.startRots = [1.56, 1.56, 1.86, 1.56, 1.86, 1.86];
    this.weight = this.weights[parseInt(localStorage.getItem("knife"))-1];
    this.scale = this.scales[parseInt(localStorage.getItem("knife"))-1];
    this.startX = this.startXs[parseInt(localStorage.getItem("knife"))-1];
    this.startY = this.startYs[parseInt(localStorage.getItem("knife"))-1];
    this.startRot = this.startRots[parseInt(localStorage.getItem("knife"))-1];

    //Get knife from local storage
    this.knife = this.physics.add.sprite(this.player.x+this.startX, this.player.y+this.startY, "knife"+localStorage.getItem("knife")).setScale(this.scale).setDepth(1.15).setRotation(this.startRot-1.56);
    this.knife.setGravity(0);
    this.knife.setBounce(.25);
    //this.knife.play("knife" + localStorage.getItem("knife"));

    //Create layers
    this.groundLayer = this.map.createLayer("groundLayer", this.tileSet);
    this.groundLayer.setCollisionByExclusion([-1]).setDepth(1.1);
    this.logLayer = this.map.createLayer("logLayer", this.tileSet).setDepth(1.2);
    this.logLayer.setCollisionByExclusion([-1]);
    this.bgLayer = this.map.createLayer("bgLayer", this.tileSet);
    this.physics.add.collider(this.player, this.groundLayer);
    //Vertical ivy layer
    this.ivyLayerVert = this.map.createLayer("ivyLayerVert", this.tileSet).setDepth(1.11);
    this.ivyLayerVert.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.knife, this.ivyLayerVert, (knife, ivy) => {
      //this.knife.body.setOffset(-1000,0);
      let ivySpr = this.physics.add.sprite((ivy.x*16)+8, (ivy.y*16)+8, "ivy");
      if(this.knife.x>ivySpr.x)
        ivySpr.flipX = true;
      let velox = this.knife.body.velocity.x;
      let veloy = this.knife.body.velocity.y;
      //this.knife.setVelocity(5,0);
      this.knife.setActive(false);
      //this.knife.x += 12;
      this.knife.setGravityY(0);
      this.time.addEvent({
        delay: 200,
        callback:() =>{
          this.knife.setVelocity(velox*3, veloy);
          this.knife.body.setOffset(0);
          this.knife.body.setGravityY(200);
        }
      })
      ivySpr.play("ivyVertAnims");
      ivy.setVisible(false);
    });      
    
    //Horizontal ivy layer
    this.ivyLayer = this.map.createLayer("ivyLayer", this.tileSet).setDepth(1.11);
    this.ivyLayer.setCollisionByExclusion([-1]);
    this.physics.add.collider(this.knife, this.ivyLayer, (knife, ivy) => {
      //this.knife.body.setOffset(-64,0);
      let ivySpr = this.physics.add.sprite((ivy.x*16)+8, (ivy.y*16)+8, "ivy");
      if(this.knife.y<ivySpr.y)
        ivySpr.flipY = true;
      let velox = this.knife.body.velocity.x;
      let veloy = this.knife.body.velocity.y;
      //this.knife.setVelocity(5,0);
      this.knife.setActive(false);
      //this.knife.y += 12;
      this.knife.setGravity(0);
      this.time.addEvent({
        delay: 200,
        callback:() =>{
          this.knife.setVelocity(velox, veloy*3);
          this.knife.body.setOffset(0);
          this.knife.body.setGravityY(200);
        }
      })
      ivySpr.play("ivyAnims");
      ivy.setVisible(false);
    });

    //Waterfall layer
    this.large = this.physics.add.sprite(-100,0,"tileSet").setOrigin(0).setVisible(false).setDepth(99).setGravity(0).setVelocityX(1000).setImmovable();
    this.time.addEvent({
      delay: 2000,
      callback:() =>{
        this.large.setVelocity(0);
      }
    })
    this.large.scaleX = .1;
    this.large.scaleY = 9;
    this.waterfallSpritesPlaced = [];
    this.waterfallLayer = this.map.createLayer("waterfallLayer", this.tileSet);
    this.waterfallLayer.setCollisionByExclusion([-1]);
    //waterfall time event
    this.waterfallEvent = this.time.addEvent({
      delay: 100,
      callback:() =>{
        this.sound.play("splash");
      }, paused: true, loop: false
    });

    this.physics.add.collider(this.large, this.waterfallLayer, (p, waterfall) => {
      if(!this.waterfallSpritesPlaced.includes(waterfall.x+""+waterfall.y)){
        this.waterfallSpritesPlaced.push(waterfall.x+""+waterfall.y);
        let y = waterfall.y*16+8;
        while (y<this.map.height*16){
          this.waterfallSpr = this.physics.add.sprite(waterfall.x*16+8,y,"waterfall").play("waterfallBody");
          this.physics.add.overlap(this.waterfallSpr, this.knife, () => {
            this.knife.x += 6;
            this.knife.alpha = .4;
        this.knife.body.velocity.x /= 2;
            this.waterfallEvent.paused = false;
            this.knife.body.setOffset(9999,0);
            this.dropsIn = this.add.sprite(this.knife.x, this.knife.y, "drops").setDepth(99).setScale(2);
            //this.dropsIn.play("drops");
            this.time.addEvent({
              delay: 200,
              callback:() =>{
                this.knife.body.setOffset(0);
                this.knife.alpha = 1;
                this.dropsOut = this.add.sprite(this.knife.x, this.knife.y, "drops").setDepth(99).setScale(2);
                //this.dropsOut.play("drops");
                this.time.addEvent({
                  delay: 1000,
                  callback:() =>{
                    this.dropsOut.destroy();
                    this.dropsIn.destroy();
                  }
                })
              }
            })
          }); //Collider
          y += 16;
        }
        waterfall.x = waterfall.y = 9999;
        waterfall.setVisible(false);
        this.large.setVelocityX(1000);
      }
    });
    //Apple layer
    this.appleLayer = this.map.createLayer("appleLayer", this.tileSet).setDepth(1.105);
    this.appleLayer.setCollisionByExclusion([-1]);

    this.physics.add.collider(this.large, this.appleLayer, (k, apple) => {
      apple.setVisible(false);
      this.apple = this.physics.add.sprite(apple.x*16+12,apple.y*16+16,"apple").setScale(.25).setDepth(1.16);
      this.large.setVelocityX(1000);
      /*
      this.setAppleRot = this.time.addEvent({
          delay: 100,
          callback:() =>{
            this.apple.x = this.knife.x;
            this.apple.y = this.knife.y;
            this.apple.rotation = this.knife.rotation;
          }, loop: true, paused: true
        })
        */
      this.setAppleRot = false;
      //Apple knife collider
      this.physics.add.overlap(this.knife, this.apple, () => {
        if(!this.setAppleRot && !this.stabbed){
          this.sound.play("apple");
          if(!localStorage.getItem("appledLevels").includes(localStorage.getItem("currentLevel")+"_")){
            localStorage.setItem("apples", parseInt(localStorage.getItem("apples"))+1);
            localStorage.setItem("appledLevels", localStorage.getItem("appledLevels")+localStorage.getItem("currentLevel")+"_");
          }
        }
        this.apple.setActive(false);
        if(!this.stabbed)
          this.setAppleRot = true;
      });
    });

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
    if(this.startingPosition == this.map.height-5){
      this.cameras.main.y += 302.4;
    }
    else if(this.startingPosition == -2){
      this.cameras.main.y -= 364;
      this.cameras.main.height = 1278;
    }
    this.cameras.main.width = 1215;
    this.time.addEvent({delay: 1000,callback:() =>{
      this.time.addEvent({
        delay: 10,
        callback:() =>{
          this.cameras.main.zoom += .05
          this.cameras.main.x += 7;
          if(this.startingPosition == this.map.height-5)
            this.cameras.main.y -= 3.6;
          else if(this.startingPosition == -2){
            this.cameras.main.y += 4.4;
            this.cameras.main.height -= 4.5;
          }
          this.cameras.main.width -= 9
        }, repeat: 84
      })
    }})
    
    //Value texts
    this.rotSpeedText = this.add.text(223, 375, "Rotation Speed: " + this.rotSpeed, {fontFamily: "Minecraft"}).setDepth(1.4).setScale(.24).setScrollFactor(0);
    this.xSpeedText = this.add.text(223, 380, "X Axis Speed: " + this.xSpeed, {fontFamily: "Minecraft"}).setDepth(1.4).setScale(.24).setScrollFactor(0);
    this.ySpeedText = this.add.text(223,385,"Y Axis Speed: " + this.ySpeed, {fontFamily: "Minecraft"}).setDepth(1.4).setScale(.24).setScrollFactor(0);

    //Get values from player
    this.rotSpeed = this.xSpeed = this.ySpeed = 0;
    this.viusalValue = this.add.line(0,0,0,0,0,0,0x000000);
    this.setForces = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.viusalValue.destroy();
        this.viusalValue = this.add.line(0,0,game.input.activePointer.worldX*2,game.input.activePointer.worldY,this.knife.x, this.knife.y ,0x000000, .5).setDepth(1.5);
        this.xSpeed = (1050 - game.input.activePointer.x*8)*this.weight;
        this.ySpeed = (game.input.activePointer.y*2 - 1150)*this.weight;
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
        if((localStorage.getItem("knife") == "1" || localStorage.getItem("knife") == "2") || localStorage.getItem("knife") == "4");
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
    
/*
    this.time.addEvent({
      delay: 10,
      callback:() =>{
        this.knife.rotation += .003
      }, loop: true
    })
    this.time.addEvent({
      delay: 1000,
      callback:() =>{
        console.log(this.knife.rotation);
      }, loop: true
    })*/
    //this.knife.setRotation(2.8);
    
    //Knife stabbing to tree event
    //knife coming from;
    this.levelDirections = [
      "left", //1
      "left", //2 
      "left", //3
      "left", //4
      "left", //5
      "left", //6
      "left", //7
      "left", //8
      "left", //9
      "left", //10
      "up",   //11
      "up",   //12
      "up",   //13
      "up",   //14
      "up",   //15
      "up",   //16
      "right",//17
      "left", //18
      "left", //19
      "left", //20
      "left", //21
      "up", //22
      "right" //23
    ];
    this.direction = this.levelDirections[parseInt(localStorage.getItem("currentLevel"))-1];
 
    //Tester
    /*
    if(this.startRot == 1.56)
      this.startRot=0;
    this.time.addEvent({
      delay: 400,
      callback:() =>{
        this.stabbes = "";
        this.knife.rotation += .2;
        console.log(this.knife.rotation);
        
        if(this.knife.rotation<2.2+this.startRot/2 && this.knife.rotation>.2+this.startRot/2)
          this.stabbes += "up ";
        if(this.knife.rotation<.8+this.startRot/2 && this.knife.rotation>-1.4+this.startRot/2)
          this.stabbes += "left ";
        if((this.knife.rotation>1.5+this.startRot/1.5 && this.knife.rotation<3.3) || (this.knife.rotation>-3.3 && this.knife.rotation<-1.8+this.startRot/3))
          this.stabbes += "right ";
        console.log(this.stabbes);
      }, loop: true
    })*/
    
    this.stabbed = false;
    this.physics.add.collider(this.knife, this.logLayer, (knife, log) => {
      if(this.direction == "left")
        this.knife.x += 3;
      else if(this.direction == "right")
        this.knife.x -= 3;
      //Check if it's stabbed
      if(this.direction == "up" && (knife.rotation<2.2+this.startRot/2 && knife.rotation>.2+this.startRot/2))
        this.stabbed = true;
      if(this.direction == "left" && (knife.rotation<.8+this.startRot/2 && knife.rotation>-1.4+this.startRot/2))
        this.stabbed = true;
      if(this.direction == "right" && ((knife.rotation>1.5+this.startRot/1.5 && knife.rotation<3.3) || (knife.rotation>-3.3 && knife.rotation<-1.8+this.startRot/3)))
        this.stabbed = true;
      
      if(this.stabbed){
        if(!localStorage.getItem("kachowedLevels").includes(localStorage.getItem("currentLevel")+"_"))
          localStorage.setItem("kachowedLevels", localStorage.getItem("kachowedLevels")+localStorage.getItem("currentLevel")+"_");
        this.rotateKnife.paused = true;
        this.knife.setVelocity(0);
        this.knife.setGravity(0);
        this.apple.setVelocity(0);
        this.apple.setGravity(0);
        if(this.setAppleRot){
          this.apple.x = this.knife.x+6;
          this.apple.y = this.knife.y;
          this.setAppleRot = false;
        }
        this.sound.play("stick");
        if((this.knife.rotation<.1 && this.knife.rotation>-.1) || (this.knife.rotation<1.8 && this.knife.rotation>1.6)){
          if(!localStorage.getItem("perfectedLevels").includes(localStorage.getItem("currentLevel")+"_"))
            localStorage.setItem("perfectedLevels", localStorage.getItem("perfectedLevels")+localStorage.getItem("currentLevel")+"_");
          this.perfectText = this.add.text(188, 400, "PERFECT!", {color: "yellow", fontFamily: "Minecraft", fontSize: "16px"}).setScale(.91).setScrollFactor(0).setDepth(1.5);
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
    this.completeText1 = this.add.text(206, 425, "KACHOW!", {fontFamily:"Minecraft", color: "lime"}).setScrollFactor(0).setScale(.5).setDepth(1.5);
      //Replay current level
    this.completeText2 = this.add.text(202, 445, "PLAY AGAIN", {fontFamily:"Minecraft"}).setScrollFactor(0).setScale(.5).setDepth(1.5).setInteractive();
    this.completeText2.on("pointerup", () => {
      this.scene.start("level");
    });
      //Start next level
    this.completeText3 = this.add.text(200, 465, "NEXT LEVEL", {fontFamily:"Minecraft"}).setScrollFactor(0).setScale(.5).setDepth(1.5).setInteractive();
    this.completeText3.on("pointerup", () => {
      if(localStorage.getItem("lastLevel") == localStorage.getItem("currentLevel")){
        localStorage.setItem("lastLevel", parseInt(localStorage.getItem("lastLevel"))+1)
        localStorage.setItem("currentLevel", localStorage.getItem("lastLevel"));
      }
      else 
        localStorage.setItem("currentLevel", parseInt(localStorage.getItem("currentLevel"))+1);
      this.scene.start("level") 
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

    this.backBut = this.add.text(252, 375, "<=", {fontFamily: "Minecraft", fontSize: "16px"}).setScrollFactor(0).setScale(.5).setDepth(100).setInteractive();
    this.backBut.on("pointerdown", () => {
      this.scene.start("menu");
    });


  }
  update(){
    //Display values
    this.rotSpeedText.setText(this.rotSpeed.toFixed(2));
    this.xSpeedText.setText(this.xSpeed.toFixed(2));
    this.ySpeedText.setText(this.ySpeed.toFixed(2));

    //Restart level if knife gets out of borders
    if((this.knife.x<0 || this.knife.x>320) && !this.stabbed)
      this.scene.start("level");

    if(this.setAppleRot == true){
      this.apple.x = this.knife.x;
      this.apple.y = this.knife.y;
      this.apple.rotation = this.knife.rotation;
    }
  }
  throw(){
    //Custom values for testing
    /*
    this.xSpeed = 500;
    this.ySpeed = -115;
    this.rotSpeed = .36;
    */

    this.player.play("throw");
    this.viusalValue.setVisible(false);
    this.time.addEvent({
      delay: 500,
      callback:() =>{
        this.knife.setRotation(this.startRot*4-1.5);
        this.knife.x --;
        this.knife.y -= 8+(this.startY-22);
        this.time.addEvent({
          delay: 250,
          callback:() =>{
            this.knife.setRotation(this.startRot*4-3);
            this.knife.y -= 6;
            this.knife.x -= 9+(17-this.startX);
            this.time.addEvent({
              delay: 250,
              callback:() =>{
                this.knife.setRotation(this.startRot*4-4.5);
                this.knife.x -= 6+(17-this.startX);
                this.knife.y -= this.startY-25;
                this.time.addEvent({
                  delay: 250,
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
