class Menu extends Phaser.Scene {
    constructor(){
        super("menuScene");
    }

    preload(){


    }

    create(){
        //this references the scene that we are making (menu)
        //displays menu text
        this.add.text(20, 20, "Rocket Patrol Menu");

        //launches the next scene
        this.scene.start("playScene");
    }

}