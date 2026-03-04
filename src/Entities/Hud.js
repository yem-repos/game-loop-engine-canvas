import { Entity } from "../Core/Entity.js";

export class Hud extends Entity {
    constructor(x = 0, y = 0) {
        super();
        this.x = x;
        this.y = y;
        this.width = 64;
        this.height = 32;
    }

    update(delta) {}
    render(ctx) {
        ctx.save();
        ctx.fillStyle = '#808080';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#111';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(
            this.store.getScore(),
            this.x + this.width / 2,
            this.y + this.height / 2
        );
        ctx.restore();
    }
}