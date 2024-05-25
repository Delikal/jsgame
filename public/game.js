const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 100 }, // Snížená gravitace pro pomalejší padání
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

let game = new Phaser.Game(config);
let tomatoes;
let robot;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let gameOverText;
let blackOverlay;
let isGameOver = false;

function preload() {
  this.load.image("background", "background.webp");
  this.load.spritesheet("tomato", "tomato.png", {
    frameWidth: 128,
    frameHeight: 128,
  });
  this.load.spritesheet("robot", "robot.png", { frameWidth: 128, frameHeight: 256 }); // Robot má 1 column a 9 rows pro idle animation
}

function create() {
  // Přidání pozadí a nastavení jeho vlastností s udržením poměru stran
  const background = this.add.image(0, 0, "background");
  background.setOrigin(0, 0);

  let scaleX = this.cameras.main.width / background.width;
  let scaleY = this.cameras.main.height / background.height;
  let scale = Math.max(scaleX, scaleY);
  background.setScale(scale).setScrollFactor(0);

  // Centrování pozadí
  background.x = this.cameras.main.width / 2 - (background.width * scale) / 2;
  background.y = this.cameras.main.height / 2 - (background.height * scale) / 2;

  // Definice idle animace pro rajčata
  this.anims.create({
    key: "idle",
    frames: this.anims.generateFrameNumbers("tomato", { start: 0, end: 5 }),
    frameRate: 10,
    repeat: -1,
  });

  // Definice idle animace pro robota
  this.anims.create({
    key: "robot_idle",
    frames: this.anims.generateFrameNumbers("robot", { start: 0, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  tomatoes = this.physics.add.group({
    collideWorldBounds: true
  });

  // Vytvoření robota
  robot = this.physics.add.sprite(
    this.cameras.main.width / 2,
    this.cameras.main.height - 128,
    "robot"
  );
  robot.setImmovable(true);
  robot.body.allowGravity = false;
  robot.displayWidth = 128;
  robot.displayHeight = 256;
  robot.setCollideWorldBounds(true);
  robot.anims.play("robot_idle");

  // Přidání kolize mezi rajčaty a robotem
  this.physics.add.collider(tomatoes, robot, catchTomato, null, this);

  // Přidání časovače pro generování nových rajčat
  this.time.addEvent({
    delay: 1000, // Každou sekundu přidá nové rajče
    callback: addTomato,
    callbackScope: this,
    loop: true,
  });

  scoreText = this.add.text(16, 16, 'Score: 0', {
    fontSize: '32px',
    fontFamily: '"Press Start 2P"',
    fill: '#fff',
    stroke: '#000',
    strokeThickness: 8
  });

  livesText = this.add.text(16, 56, 'Lives: 3', {
    fontSize: '32px',
    fontFamily: '"Press Start 2P"',
    fill: '#fff',
    stroke: '#000',
    strokeThickness: 8
  });

  blackOverlay = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0);
  blackOverlay.setOrigin(0, 0);
  blackOverlay.depth = 10;

  gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'You lost\nPress any button to start again', {
    fontSize: '36px',
    fontFamily: '"Press Start 2P"',
    fill: '#fff',
    stroke: '#000',
    strokeThickness: 8,
    align: 'center'
  });
  gameOverText.setOrigin(0.5, 0.5);
  gameOverText.setVisible(false);
  gameOverText.depth = 11; // Zajistí, že text je nad overlayem

  // Přidání ovládání klávesnicí
  this.input.keyboard.on('keydown-LEFT', () => {
    robot.setVelocityX(-1000);
  });
  this.input.keyboard.on('keydown-RIGHT', () => {
    robot.setVelocityX(1000);
  });
  this.input.keyboard.on('keyup-LEFT', () => {
    if (robot.body.velocity.x < 0) {
      robot.setVelocityX(0);
    }
  });
  this.input.keyboard.on('keyup-RIGHT', () => {
    if (robot.body.velocity.x > 0) {
      robot.setVelocityX(0);
    }
  });

  // Přidání ovládání myší nebo dotykem
  this.input.on('pointerdown', (pointer) => {
    if (pointer.x < this.cameras.main.width / 2) {
      robot.setVelocityX(-1000);
    } else {
      robot.setVelocityX(1000);
    }
  });

  this.input.on('pointerup', () => {
    robot.setVelocityX(0);
  });

  this.input.keyboard.on('keydown', restartGame, this);
}

function update() {
  tomatoes.children.iterate(function (child) {
    if (child.y > game.config.height && child.active) {
      child.disableBody(true, true);
      loseLife.call(this);
    }
  }, this);
}

function addTomato() {
  const x = Phaser.Math.Between(0, game.config.width);
  const tomato = tomatoes.create(x, 0, "tomato");

  tomato.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  tomato.setVelocityX(Phaser.Math.Between(-50, 50)); // Náhodná horizontální rychlost
  tomato.setVelocityY(Phaser.Math.Between(50, 150)); // Náhodná vertikální rychlost
  tomato.setAngularVelocity(Phaser.Math.Between(-100, 100)); // Náhodná rotace
  tomato.setScale(1);
  tomato.anims.play("idle"); // Přehrát idle animaci
}

function catchTomato(robot, tomato) {
  tomato.disableBody(true, true);
  score += 10;
  scoreText.setText("Score: " + score);
}

function loseLife() {
  if (!isGameOver) {
    lives--;
    livesText.setText("Lives: " + lives);
    if (lives <= 0) {
      // Konec hry
      isGameOver = true;
      this.physics.pause();
      this.time.addEvent({
        delay: 100,
        callback: () => {
          blackOverlay.fillAlpha += 0.05;
          if (blackOverlay.fillAlpha >= 1) {
            this.time.removeAllEvents();
            gameOverText.setVisible(true);
          }
        },
        callbackScope: this,
        loop: true
      });
    }
  }
}

function restartGame(event) {
  if (isGameOver) {
    // Resetování hry
    this.scene.restart();
    lives = 3;
    score = 0;
    isGameOver = false;
    blackOverlay.fillAlpha = 0;
    gameOverText.setVisible(false);
  }
}
