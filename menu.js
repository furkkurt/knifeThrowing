//Main Menu
class menu extends Phaser.Scene{
  constructor(){
    super("menu")
  }
  create(){
    this.levelSelector = this.add.text(-10,10,"LEVELS").setScale(8).setInteractive();
    this.levelSelector.on("pointerdown", () => {this.scene.start("levels")});
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
      eval("this.level"+i+"But = this.add.text(60, "+i*100+", 'Level "+i+"').setScale(4).setInteractive()");
      if(this.level0But.text == "Level 0")
        this.level0But.text = "Tutorial";
      if(i==0)
        eval("this.level0But.on('pointerdown', () => {this.scene.start('tutorial')})");
      else{
        eval("localStorage.setItem('currentLevel', '"+i+"')");
        eval("this.level"+i+"But.on('pointerdown', () => {localStorage.setItem('currentLevel', '"+i+"'); this.scene.start('level')})");
      }
    }

    this.scrollToTopBut = this.add.text(425,575,"^\n|").setScale(2).setInteractive().on("pointerdown", () => {this.cameras.main.y = 0; this.scrollDownBut.y = 750; this.scrollUpBut.y = 700; this.scrollToBottomBut.y = 825; this.scrollToTopBut.y = 575});
    this.scrollUpBut = this.add.text(423,700,"^").setScale(2.5).setInteractive().on("pointerdown", () => {this.cameras.main.y += 100; this.scrollUpBut.y -= 100; this.scrollDownBut.y -= 100; this.scrollToBottomBut.y -= 100; this.scrollToTopBut.y -= 100});
    this.scrollDownBut = this.add.text(425,750,"v").setScale(2).setInteractive().on("pointerdown", () => {this.cameras.main.y -= 100; this.scrollDownBut.y += 100; this.scrollUpBut.y += 100; this.scrollToBottomBut.y += 100; this.scrollToTopBut.y += 100});
    this.scrollToBottomBut = this.add.text(425,825,"|\nV").setScale(2).setInteractive().on("pointerdown", () => {this.cameras.main.y = parseInt(localStorage.getItem("lastLevel"))*-100+800; this.scrollDownBut.y = -this.cameras.main.y+750; this.scrollUpBut.y = -this.cameras.main.y+700; this.scrollToBottomBut.y = -this.cameras.main.y+825; this.scrollToTopBut.y = -this.cameras.main.y+575});
  }
}
