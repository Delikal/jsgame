import { preload } from './preload.js';
import { create } from './create.js';
import { update } from './update.js';

export let playerVelocity = 500; // Počáteční rychlost

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

