import game, { getPlayerVelocity, increasePlayerVelocity } from './main.js';

export function addTomato(scene) {
    const x = Phaser.Math.Between(0, scene.game.config.width);
    const tomato = scene.tomatoes.create(x, 0, "tomato");

    tomato.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    tomato.setVelocityX(Phaser.Math.Between(-50, 50));
    tomato.setVelocityY(Phaser.Math.Between(50, 150));
    tomato.setAngularVelocity(Phaser.Math.Between(-100, 100));
    tomato.setScale(1);
    tomato.anims.play("idle");
}

export function catchTomato(robot, tomato) {
    tomato.disableBody(true, true);
    const scene = robot.scene;
    scene.score += 10;
    scene.scoreText.setText("Score: " + scene.score);

    if (scene.score % scene.levelUpScore === 0) {
        robot.anims.play("robot_levelup");
        scene.time.delayedCall(1800, () => { // Počkáme na dokončení animace dvakrát
            pauseGame(scene);
            showPowerUp(scene);
        });
    }
}

export function loseLife(scene) {
    if (!scene.isGameOver) {
        scene.lives--;
        scene.livesText.setText("Lives: " + scene.lives);
        if (scene.lives <= 0) {
            scene.isGameOver = true;
            scene.physics.pause();
            scene.time.addEvent({
                delay: 100,
                callback: () => {
                    scene.blackOverlay.fillAlpha += 0.05;
                    if (scene.blackOverlay.fillAlpha >= 1) {
                        scene.time.removeAllEvents();
                        scene.gameOverText.setVisible(true);
                    }
                },
                loop: true,
            });
        }
    }
}

export function restartGame(scene, event) {
    if (scene.isGameOver) {
        scene.scene.restart();
        scene.lives = 3;
        scene.score = 0;
        scene.isGameOver = false;
        scene.blackOverlay.fillAlpha = 0;
        scene.gameOverText.setVisible(false);
    }
}

export function pauseGame(scene) {
    scene.physics.pause();
    scene.tomatoTimer.paused = true;
    scene.cloudTimer.paused = true;
    scene.blackOverlay.setVisible(true);
}

export function showPowerUp(scene) {
    scene.coffeePowerUp.setVisible(true);
    scene.speedText.setVisible(true);
}

export function handleLevelUp(scene) {
    scene.robot.anims.play("robot_idle"); // Vrátí animaci zpět na idle
    increasePlayerVelocity(100); // Aktualizuje globální rychlost
    updateSpeedText(scene, getPlayerVelocity() / 100);
    scene.coffeePowerUp.setVisible(false);
    scene.speedText.setVisible(false);
    scene.blackOverlay.setVisible(false);
    scene.blackOverlay.fillAlpha = 0;
    scene.physics.resume();
    scene.cloudTimer.paused = false;
    scene.tomatoTimer.paused = false;
}

export function updateSpeedText(scene, speedLevel) {
    scene.speedText.setText(`Speed: ${speedLevel} (+1)`);
}
