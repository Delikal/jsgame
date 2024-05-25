import { addTomato, catchTomato, loseLife, restartGame } from './utils.js';

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
        frames: this.anims.generateFrameNumbers("robot_levelup", { start: 0, end: 6 }),
        frameRate: 10,
        repeat: -1,
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

    this.physics.add.collider(this.tomatoes, this.robot, catchTomato, null, this);

    // Časovač pro generování rajčat
    this.time.addEvent({
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
    this.blackOverlay = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0x000000, 0)
        .setOrigin(0, 0)
        .setDepth(10);

    this.gameOverText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'You lost\nPress any button to start again', {
        fontSize: '36px',
        fontFamily: '"Press Start 2P"',
        fill: '#fff',
        stroke: '#000',
        strokeThickness: 8,
        align: 'center',
    }).setOrigin(0.5, 0.5).setVisible(false).setDepth(11);

    // Ovládání
    this.input.keyboard.on('keydown-LEFT', () => this.robot.setVelocityX(-1000));
    this.input.keyboard.on('keydown-RIGHT', () => this.robot.setVelocityX(1000));
    this.input.keyboard.on('keyup-LEFT', () => {
        if (this.robot.body.velocity.x < 0) this.robot.setVelocityX(0);
    });
    this.input.keyboard.on('keyup-RIGHT', () => {
        if (this.robot.body.velocity.x > 0) this.robot.setVelocityX(0);
    });

    this.input.on('pointerdown', (pointer) => {
        if (pointer.x < this.cameras.main.width / 2) {
            this.robot.setVelocityX(-1000);
        } else {
            this.robot.setVelocityX(1000);
        }
    });

    this.input.on('pointerup', () => this.robot.setVelocityX(0));

    this.input.keyboard.on('keydown', (event) => restartGame(this, event));
}
