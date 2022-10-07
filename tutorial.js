class scene extends Phaser.Scene{
  constructor(){
    super("tutorial")
  }
  create(){
    //Create tilemap and layers
    this.map = this.make.tilemap({
      key: "tutorial",
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
    this.player = this.physics.add.sprite(3*16, 5*16,"locke").setDepth(1.2).setOrigin(0);
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
    this.sound.play("seaAmbiance", {loop: true, volume:.15});
    
    //Create tides
    for (let i=0; i<(this.bgLayer.width/16); i++){
      eval("this.add.sprite("+i*16+", 5.25*16, 'tide').play('tide').setOrigin(0)");
    }

    //Camera
    this.cameras.main.setZoom(6);
    this.cameras.main.startFollow(this.player);   

    //Value texts
    this.rotSpeedText = this.add.text(220, 375, "Rotation Speed: " + this.rotSpeed).setDepth(1.4).setScale(.2).setScrollFactor(0);
    this.xSpeedText = this.add.text(220, 380, "X Axis Speed: " + this.xSpeed).setDepth(1.4).setScale(.2).setScrollFactor(0);
    this.ySpeedText = this.add.text(220,385,"Y Axis Speed: " + this.ySpeed).setDepth(1.4).setScale(.2).setScrollFactor(0);

    //Get values from player
    this.rotSpeed = this.xSpeed = this.ySpeed = 0;
    this.viusalValue = this.add.line(0,0,20,20,30,20,0xff0000);
    this.setForces = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.viusalValue.destroy();
        this.viusalValue = this.add.line(0,0,game.input.activePointer.worldX*2,game.input.activePointer.worldY,this.knife.x, this.knife.y ,0x000000, .5).setDepth(1.5);
        this.xSpeed = ((this.player.x - game.input.activePointer.x)+200)*this.weight*8;
        this.ySpeed = ((game.input.activePointer.y - this.player.y)-400)*this.weight;
      }, loop: true,
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
    this.screen.alpha = 0.01;
    //Pointer down (set x and y velocities and start increasing rotation speed value)
    this.screen.on("pointerdown", () => {
      this.setForces.paused=true;
      this.viusalValue.strokeColor = 0xff0000;
      this.viusalValue.strokeAlpha = 0;
      this.increaseRotSpeed.paused = false;
      console.log("deneme")
    });
    //Pointer up (stop increasing rotation speed value and execute throw function)
    this.screen.on("pointerup", ()=>{
      this.increaseRotSpeed.paused = true;
      this.throw();
      this.screen.setVisible(false);
    });


    //Rotate knife
    this.rotateKnife = this.time.addEvent({
      delay: 20,
      callback:() =>{
        this.knife.rotation += this.rotSpeed;
      },loop: true, paused: true
    });
  
    //Knife dropping to gorund layer event
    this.physics.add.collider(this.knife, this.groundLayer, () => {
      this.knife.setVelocity(0); 
      this.rotateKnife.paused = true;
      if(this.knife.rotation>2.3 || this.knife.rotation<-0.3){
        this.knife.rotation = 0;
      }
      this.time.addEvent({
        delay: 500,
        callback:() =>{
          this.cameras.main.startFollow(this.player);
          this.time.addEvent({
            delay: 1000,
            callback:() =>{
              this.scene.start("tutorial");
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
        //Don't complete the level if the collision takes place in tutorial scene
        if(!this.tutor)
          this.levelCompleteFade.paused = false;
        this.levelComplete.setVisible(true);
      } else {
        this.sound.play("blop");
      }
    });

    //Level Complete
    this.completeText1 = this.add.text(220, 420, "YOU WON").setScrollFactor(0).setScale(.2).setDepth(1.5);
      //Replay current level
    this.completeText2 = this.add.text(200, 430, "PLAY AGAIN").setScrollFactor(0).setScale(.2).setDepth(1.5).setInteractive();
    this.completeText2.on("pointerdown", () => {
      this.time.addEvent({
        delay: 500,
        callback:() =>{
          this.scene.start("tutorial")
        }
      })
    });
      //Start next level
    this.completeText3 = this.add.text(230, 430, "NEXT LEVEL").setScrollFactor(0).setScale(.2).setDepth(1.5).setInteractive();
    this.completeText3.on("pointerdown", () => {
      this.time.addEvent({
        delay: 500,
        callback:() =>{
          this.scene.start("level1")
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

    //Tutorial 
    this.tutorText = this.add.text(189, 380, "").setDepth(1.4).setScale(.2).setScrollFactor(0);
    this.tutorContext = "Welcome to the island! Your goal here\nis to shoot that log over there.";
    this.tutorContext2 = "It won't always be placed as simple\nas it is now.";
    this.tutorContext3 = "There are three important values you\nmust think of when throwing a knife";
    this.tutorContext4 = "First value is your rotation speed,\nit shows how fast you knife rotates";
    this.tutorContext5 = "Second one is your speed on X axis and\nthe last one is your speed on Y axis.";
    this.tutorContext6 = "When throwing a knife, you first think\nof the speed you'll give to it\n(move the mouse around to change\nyour speed values) And after\nsetting the speed and angle in your\nmind you have to give the blade\ncorrect amount of flips\n(hold your mouse/finger down to\nincrease the rotation speed and\nrelease when you reach the\nvalue of your choice)";
    this.i = 0;
    this.tutor = true;
    this.time.addEvent({delay: 1000, callback:() =>{
      //Text 1
      this.time.addEvent({delay: 30, callback:() =>{
        this.tutorText.text += this.tutorContext.charAt(this.i);
        this.i++;
      },repeat: this.tutorContext.length});
      //Camera focus
      this.time.addEvent({delay: 5000, callback:() =>{
        this.cameras.main.startFollow(this.player);
      }});
      //Text 2
      this.time.addEvent({delay: 6000, callback:() =>{
        this.tutorText.setText("");
        this.i = 0;
        this.time.addEvent({ delay: 30, callback:() =>{
          this.tutorText.text += this.tutorContext2.charAt(this.i);
          this.i++;
        }, repeat: this.tutorContext2.length});
      }});
      //Text 3
      this.time.addEvent({delay: 9000, callback:() =>{
        this.tutorText.setText("");
        this.i = 0;
        this.time.addEvent({
          delay: 30, callback:() =>{
            this.tutorText.text += this.tutorContext3.charAt(this.i);
            this.i++;
        }, repeat: this.tutorContext3.length});
      }});
      //Text 4
      this.time.addEvent({delay: 13000, callback:() =>{
        this.sound.play("swosh", {volume:1.5});
        this.tutorText.y += 5;
        this.rotSpeedText.setVisible(true);
        this.tutorText.setText("");
        this.i = 0;
        this.time.addEvent({
          delay: 30, callback:() =>{
            this.tutorText.text += this.tutorContext4.charAt(this.i);
            this.i++;
        }, repeat: this.tutorContext4.length});
      }});
      //Text 5
      this.time.addEvent({delay: 17000, callback:() =>{
        this.sound.play("swosh", {volume:1.5});
        this.tutorText.y += 5;
        this.xSpeedText.setVisible(true);
        this.time.addEvent({delay: 500, callback:() =>{
          this.sound.play("swosh", {volume:1.5});
          this.tutorText.y += 5;
          this.ySpeedText.setVisible(true);   
        }});
        this.tutorText.setText("");
        this.i = 0;
        this.time.addEvent({delay: 1000,callback:() =>{
          this.time.addEvent({
            delay: 30, callback:() =>{
              this.tutorText.text += this.tutorContext5.charAt(this.i);
              this.i++;
          }, repeat: this.tutorContext5.length});
        }})
      }});
      //Text 6
      this.time.addEvent({delay: 21000, callback:() =>{
        this.tutorText.setText("");
        this.i = 0;
        this.time.addEvent({
          delay: 30, callback:() =>{
            this.tutorText.text += this.tutorContext6.charAt(this.i);
            this.i++;
        }, repeat: this.tutorContext6.length});
        this.endTutorial();
      }});
    }
  });
  
  //Various settings for tutorial scene
    this.setForces.paused = true;
    this.screen.visible = this.xSpeedText.visible = this.ySpeedText.visible = this.rotSpeedText.visible = this.screen.visible = false;
    this.rotSpeed = .225;
    this.xSpeed = 400;
    this.ySpeed = 60;
    this.throw();
    this.levelCompleteBox.setDepth(-1);
    this.levelComplete.setDepth(-1);
  }
  update(){
    //Display values
    this.rotSpeedText.setText(this.rotSpeed.toFixed(2));
    this.xSpeedText.setText(this.xSpeed.toFixed(2));
    this.ySpeedText.setText(this.ySpeed.toFixed(2));

    //Restart level if knife gets out of borders
    if(this.knife.x<0 || this.knife.x>320)
      this.scene.start("tutorial");
  }
  endTutorial(){
    //Change values to defaults to end the tutorial segment
    this.tutor = false;
    this.screen.visible = true;
    this.levelCompleteFade.repeat = 1;
    this.setForces.paused = false;
    this.xSpeed = this.ySpeed = this.rotSpeed = 0;
    this.knife.x = this.player.x+17;
    this.knife.y = this.player.y+22;
    this.levelCompleteBox.alpha = 0;
    this.levelComplete.setVisible(false);
    this.levelCompleteBox.setDepth(1.45);
    this.levelComplete.setDepth(1.46);
    this.time.addEvent({
      delay: 9000,
      callback:() =>{
        this.tutorText.setVisible(false);
      }
    });
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

