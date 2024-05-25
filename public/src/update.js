import { loseLife } from './utils.js';

export function update() {
    this.tomatoes.children.iterate(function (child) {
        if (child.y > this.game.config.height && child.active) {
            child.disableBody(true, true);
            loseLife(this);
        }
    }, this);
}
