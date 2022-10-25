//Main Menu
class menu extends Phaser.Scene{
  constructor(){
    super("menu")
  }
  create(){
    this.levelSelector = this.add.text(5,10,"LEVELS", {fontFamily: "Minecraft", fontSize:"112px"}).setInteractive();
    this.levelSelector.on("pointerdown", () => {this.scene.start("levels")});

    this.levelSelector = this.add.text(15,150,"KNIVES", {fontFamily: "Minecraft", fontSize:"112px"}).setInteractive();
    this.levelSelector.on("pointerdown", () => {this.scene.start("knives")});
  }
}

//Level Selector
class levels extends Phaser.Scene{
  constructor(){
    super("levels")
  }
  create(){
    this.cameras.main.height = (parseInt(localStorage.getItem("lastLevel"))+1)*100+900;
    
    if(localStorage.getItem("lastLevel") == undefined)
      localStorage.setItem("lastLevel", 0);
    for(let i=0; i<=parseInt(localStorage.getItem("lastLevel")); i++){
      eval("this.level"+i+"But = this.add.text(0, "+i*100+", 'Level "+i+"', {fontFamily: 'Minecraft', fontSize:'72px'}).setInteractive()");
      eval("this.level"+i+"kachow = this.add.text(295, "+i*100+"+0, 'KACHOW!', {color: 'lime', fontFamily:'Minecraft'}).setVisible(true).setScale(1.5)");
      eval("this.level"+i+"kachow = this.add.text(295, "+i*100+"+25, 'PERFECT!', {color: 'yellow', fontFamily:'Minecraft'}).setVisible(true).setScale(1.5)");
      eval("this.level"+i+"kachow = this.add.text(295, "+i*100+"+50, 'APPLE!', {color: 'red', fontFamily:'Minecraft'}).setVisible(true).setScale(1.5)");
      if(this.level0But.text == "Level 0")
        this.level0But.text = "Tutorial";
      if(i==0)
        eval("this.level0But.on('pointerdown', () => {this.scene.start('tutorial')})");
      else{
        eval("localStorage.setItem('currentLevel', '"+i+"')");
        eval("this.level"+i+"But.on('pointerdown', () => {localStorage.setItem('currentLevel', '"+i+"'); this.scene.start('level')})");
      }
    }

    this.scrollToTopBut = this.add.text(443,675,"V\nV", {fontFamily: "Minecraft"}).setScale(2).setInteractive().on("pointerdown", () => {this.cameras.main.y = 0; this.scrollDownBut.y = 775; this.scrollUpBut.y = 700; this.scrollToBottomBut.y = 800; this.scrollToTopBut.y = 675}).setRotation(3.16);
    this.scrollUpBut = this.add.text(423,700,"^", {fontFamily: "Minecraft"}).setScale(2.5).setInteractive().on("pointerdown", () => {this.cameras.main.y += 100; this.scrollUpBut.y -= 100; this.scrollDownBut.y -= 100; this.scrollToBottomBut.y -= 100; this.scrollToTopBut.y -= 100});
    this.scrollDownBut = this.add.text(443,775,"^", {fontFamily: "Minecraft"}).setScale(2.5).setInteractive().on("pointerdown", () => {this.cameras.main.y -= 100; this.scrollDownBut.y += 100; this.scrollUpBut.y += 100; this.scrollToBottomBut.y += 100; this.scrollToTopBut.y += 100}).setRotation(3.16);
    this.scrollToBottomBut = this.add.text(425,800,"V\nV", {fontFamily: "Minecraft"}).setScale(2).setInteractive().on("pointerdown", () => {this.cameras.main.y = parseInt(localStorage.getItem("lastLevel"))*-100+800; this.scrollDownBut.y = -this.cameras.main.y+775; this.scrollUpBut.y = -this.cameras.main.y+700; this.scrollToBottomBut.y = -this.cameras.main.y+800; this.scrollToTopBut.y = -this.cameras.main.y+675});
  }
}

//Knife Selector
class knives extends Phaser.Scene{
  constructor(){
    super("knives")
  }
  create(){
    this.cameras.main.height = (parseInt(localStorage.getItem("lastLevel"))+1)*100+900;
    this.knife1 = this.add.sprite(250,75,"knife1").play("knife1").setDepth(2).setScale(6).setInteractive();
    this.knife2 = this.add.sprite(225,150,"knife2").play("knife2").setDepth(2).setScale(4.5).setInteractive();
    this.knife3 = this.add.sprite(230,250,"knife3").play("knife3").setDepth(2).setScale(8).setRotation(1.58).setInteractive();
    this.knife4 = this.add.sprite(250,350,"knife4").play("knife4").setDepth(2).setScale(6).setInteractive();
    this.knife5 = this.add.sprite(230,450,"knife5").play("knife5").setDepth(2).setScale(8).setRotation(1.58).setInteractive();
    this.knife6 = this.add.sprite(230,550,"knife6").play("knife6").setDepth(2).setScale(8).setRotation(1.58).setInteractive();
    
    for (let i = 1; i<7; i++)
      eval("this.knife"+i+".on('pointerdown', () => {localStorage.setItem('knife', '"+i+"'); this.scene.start('menu')})");
  }
}
