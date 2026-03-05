import { Entity } from "../Core/Entity.js";

export class Spawner extends Entity {
    width = 64;
    cursor = 'pointer';
    
    constructor (x = 0, y = 0, onSpawn = () => {}) {
        super();
        this.x = x;
        this.y = y;
        this.onSpawn = onSpawn;
    }

    onMouseJustReleased (mouse) {
        this.onSpawn(mouse, this.sceneAPI);
    }

    update(dt) {}
    render(ctx) {
        ctx.fillStyle = this.isHovered ? 'purple' : '#808080';
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.fillStyle = '#111';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.fillText(
            'Spawn',
            this.x + this.width / 2,
            this.y + this.height / 2
        );
    }
}