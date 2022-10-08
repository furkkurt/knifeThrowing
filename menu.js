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
    if(localStorage.getItem("lastLevel") == undefined)
      localStorage.setItem("lastLevel", 0);
    for(let i=0; i<=parseInt(localStorage.getItem("lastLevel")); i++){
      eval("this.level"+i+"But = this.add.text(60, "+i*100+", 'Level "+i+"').setScale(4).setInteractive()");
      if(this.level0But.text == "Level 0")
        this.level0But.text = "Tutorial";
      eval("this.level"+i+"But.on('pointerdown', () => {this.scene.start(this.level"+i+"But.text.toLowerCase())})");
    }
  }
}
