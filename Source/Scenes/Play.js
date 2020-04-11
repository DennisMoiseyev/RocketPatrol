//init()- prepares any data for the scene
//preload()- prepares any assets we'll need for the scene
//create()- adds assetts to the scene
//update()- loop runs continuously at hopefully (our chosen frame rate)
class Play extends Phaser.Scene{
    constructor(){
        super("playScene");
    }

    preload(){
        //load images and the tile sprite
        this.load.image("rocket", "./Assets/rocket.png");
        this.load.image("spaceship", "./Assets/spaceship.png");
        this.load.image("starfield", "./Assets/starfield.png");
        this.load.spritesheet("explosion", "./Assets/explosion.png", {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
       
       
    }

    create(){
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, "starfield").setOrigin(0,0);

        
        
        //white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0,0);

        //green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431,"rocket").setScale(0.5,0.5).setOrigin(0,0);

        //add space ships
        this.ship01 = new Spaceship(this, game.config.width +192, 132, "spaceship", 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width +96, 196, "spaceship", 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, "spaceship", 0, 10).setOrigin(0,0);

        //define keyboard keys
        keyF= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT= this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation configuration
        this.anims.create({

            key: "explode",
            frames: this.anims.generateFrameNumbers("explosion", {start: 0, end: 9, first: 0}), frameRate: 30

        });

        //score
        this.p1score= 0;

        //score display
        let scoreConfig = {
            fontFamily: "Courier",
            fontSize: "28px",
            backgroundColor: "#F3B141",
            color: "#843605",
            align: "right",
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        this.scoreLeft= this.add.text(69, 54, this.p1score, scoreConfig); 

        //game over flag
        this.gameOver= false;

        //60 Second Play Clock
        scoreConfig.fixedWidth= 0;
        this.clock= this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, "GAME OVER", scoreConfig).setOrigin(0.5);  
            this.add.text(game.config.width/2, game.config.height/2 +64, "(F)ire to Restart or <- for Menu", scoreConfig).setOrigin(0.5); 
            this.gameOver= true;
        }, null, this);
    }

    update(){
        //check key input for restart
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)){
            this.scene.start("menuScene"); 

        }
        //scroll starfields
        this.starfield.tilePositionX -= 4;

        if(!this.gameOver){

        this.p1Rocket.update();//update rocket
        this.ship01.update();//update spaceship01
        this.ship02.update();//update spaceship02
        this.ship03.update();//update spaceship03

        }
        
        //check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }

        if(this.checkCollision(this.p1Rocket, this.ship02)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }

        if(this.checkCollision(this.p1Rocket, this.ship01)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        
    }
    checkCollision(rocket, ship){
        //Axis-Alligned Bounding Boxes Checking
        if(rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y){
                return true;
            }

            else{

                return false;
            }
    }

    shipExplode(ship){
        ship.alpha = 0; //temporarily hide the ship
        let boom = this.add.sprite(ship.x,ship.y, "explosion").setOrigin(0,0); //create explosion sprite at ship's position
        boom.anims.play("explode"); //play the explode animation
        boom.on("animationcomplete", () => { //callback after animation completes
            ship.reset(); //reset the postition of the ship
            ship.alpha =1; //make ship visible again
            boom.destroy(); //kill animation (remove sprite)
        });
        //score increment and repaint
        this.p1score += ship.points;
        this.scoreLeft.text = this.p1score;
        this.sound.play("sfx_explosion");


    }

}