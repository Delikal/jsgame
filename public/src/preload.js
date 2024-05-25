export function preload() {
    this.load.image("background", "assets/background.webp");
    this.load.spritesheet("tomato", "assets/tomato.png", { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet("robot", "assets/robot_idle.png", { frameWidth: 128, frameHeight: 256 });
    this.load.spritesheet("robot_levelup", "assets/robot_levelup.png", { frameWidth: 128, frameHeight: 256 });
}
