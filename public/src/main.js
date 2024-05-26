import { preload } from './preload.js';
import { create } from './create.js';
import { update } from './update.js';

let playerVelocity = 500; // Počáteční rychlost

export const getPlayerVelocity = () => playerVelocity;
export const increasePlayerVelocity = (value) => playerVelocity += value;

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 100 },
            debug: false,
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
};

const game = new Phaser.Game(config);
export default game;

