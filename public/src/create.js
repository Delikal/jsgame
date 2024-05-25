import { addTomato, catchTomato, loseLife, restartGame, handleLevelUp, updateSpeedText } from './utils.js';
import { playerVelocity } from './main.js';

export function create() {
    // Přidání pozadí
    const background = this.add.image(0, 0, "background").setOrigin(0, 0);
    let scaleX = this.cameras.main.width / background.width;
    let scaleY = this.cameras.main.height / background.height;
    let scale = Math.max(scaleX, scaleY);
    background.setScale(scale).setScrollFactor(0);
    background.x = this.cameras.main.width / 2 - (background.width * scale) / 2;
    background.y = this.cameras.main.height / 2 - (background.height * scale) / 2;

    // Animace rajčat
    this.anims.create({
        key: "idle",
        frames: this.anims.generateFrameNumbers("tomato", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
    });

    // Animace robota
    this.anims.create({
        key: "robot_idle",
        frames: this.anims.generateFrameNumbers("robot", { start: 0, end: 8 }),
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: "robot_levelup",
        frames: this.anims.generateFrameNumbers("robot_levelup", { start: 0, end: 8 }),
        frameRate: 10,
        repeat: 2, // Animaci spustíme dvakrát
    });

    // Skupina rajčat
    this.tomatoes = this.physics.add.group({
        collideWorldBounds: true,
    });

    // Robot
    this.robot = this.physics.add.sprite(this.cameras.main.width / 2, this.cameras.main.height - 128, "robot")
        .setImmovable(true)
        .setCollideWorldBounds(true)
        .anims.play("robot_idle");

    this.robot.setVelocityX(0); // Nastavení počáteční rychlosti na 0

    this.physics.add.collider(this.tomatoes, this.robot, catchTomato, null, this);

    // Časovač pro generování rajčat
    this.tomatoTimer = this.time.addEvent({
        delay: 1000,
        callback: () => addTomato(this),
        loop: true,
    });

    // Skóre a životy
    this.score = 0;
    this.levelUpScore = 100;
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
        fontSize: '32px',
        fontFamily: '"Press Start 2P"',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 8,
    });

    this.lives = 3;
    this.livesText = this.add.text(16, 56, 'Lives: 3', {
        fontSize: '32px',
        fontFamily: '"Press Start 2P"',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 8,
    });

    // Overlay a game over text
    this.blackOverlay = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0.5)
        .setOrigin(0, 0)
        .setDepth(10)
        .setVisible(false);

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'You lost\nPress any button to start again', {
        fontSize: '36px',
        fontFamily: '"Press Start 2P"',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 8,
        align: 'center',
    }).setOrigin(0.5, 0.5).setVisible(false).setDepth(11);

    // Power-up tlačítko
    this.coffeePowerUp = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2, 'coffee_powerup')
        .setDisplaySize(128, 128)
        .setOrigin(0.5, 0.5)
        .setDepth(12) // Zajistí, že bude nad overlayem
        .setVisible(false)
        .setInteractive()
        .on('pointerdown', () => handleLevelUp(this));

    // Text rychlosti pod power-upem
    this.speedText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2 + 80, 'Speed: 5 (+1)', {
        fontSize: '24px',
        fontFamily: '"Press Start 2P"',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 8,
        align: 'center',
    }).setOrigin(0.5, 0.5).setVisible(false).setDepth(13); // Zajistí, že bude nad overlayem

    // Ovládání
    this.input.keyboard.on('keydown-LEFT', () => this.robot.setVelocityX(-playerVelocity));
    this.input.keyboard.on('keydown-RIGHT', () => this.robot.setVelocityX(playerVelocity));
    this.input.keyboard.on('keyup-LEFT', () => {
        if (this.robot.body.velocity.x < 0) this.robot.setVelocityX(0);
    });
    this.input.keyboard.on('keyup-RIGHT', () => {
        if (this.robot.body.velocity.x > 0) this.robot.setVelocityX(0);
    });

    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < this.cameras.main.width / 2) {
            this.robot.setVelocityX(-playerVelocity);
        } else {
            this.robot.setVelocityX(playerVelocity);
        }
    });

    this.input.on('pointerup', () => this.robot.setVelocityX(0));

    this.input.keyboard.on('keydown', (event) => restartGame(this, event));
}
