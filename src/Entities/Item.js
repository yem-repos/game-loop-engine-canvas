import { Entity } from "../Core/Entity.js";

export class Item extends Entity {
    dragStartMouseX = 0;
    dragStartMouseY = 0;

    dragStartEntityX = 0;
    dragStartEntityY = 0;

    cursor = 'pointer';

    #initialLives = 3;
    #lives = 3;

    constructor (x = 0, y = 0) {
        super(x, y);
        this.x = x;
        this.y = y;
        this.#lives = Math.floor(Math.random() * 5) + 1;
        this.#initialLives = this.#lives;
        console.log(`new Item(${this.baseX}, ${this.baseY})`);
    }

    #damage () {
        this.#lives -= 1;
    }

    // Mouse Enter
    onMouseEnter (mouse) {
        console.log('Enter', this.store.getScore());
    }

    // Mouse Over (Hover)
    onMouseOver (mouse) {
        // console.log('Over', mouse);
    }

    // Mouse Just Pressed
    onMouseJustPressed (mouse) {
        // console.log('JustPressed');
        this.dragStartMouseX = mouse.x;
        this.dragStartMouseY = mouse.y;

        this.dragStartEntityX = this.x;
        this.dragStartEntityY = this.y;
    }

    // Mouse Hold
    onMouseHold (mouse) {
        // console.log('Mouse Hold', mouse);
    }

    // Mouse Drag
    onMouseDrag (mouse) {
        let mode = 'clamp'; // default | clamp
        const dx = mouse.x - this.dragStartMouseX;
        const dy = mouse.y - this.dragStartMouseY;

        // Default
        if (mode === 'default') {
            this.x = this.dragStartEntityX + dx;
            this.y = this.dragStartEntityY + dy;
        }

        // Clamp
        if (mode === 'clamp') {
            let newX = this.dragStartEntityX + dx;
            let newY = this.dragStartEntityY + dy;
            
            const { width: sw, height: sh } = this.sceneAPI.getSize();
            const maxX = sw - this.width;
            const maxY = sh - this.height;
            
            this.x = Math.max(0, Math.min(newX, maxX));
            this.y = Math.max(0, Math.min(newY, maxY));
        }
        // console.log('Mouse Drag', mouse);
    }

    // Mouse Just Released
    onMouseJustReleased (mouse) {
        
        // Damage
        this.#damage();

        // Destroy item
        if (this.#lives <= 0) {
            this.destroy();
            this.store.dispatch('ITEM_DESTROYED');
        } 
        
        // console.log('Mouse Just Released', mouse);
        // this.sceneAPI.add(new Item(200, 200))
    }

    // Mouse Leave
    onMouseLeave (mouse) {
        console.log('Leave', mouse);
    }

    // Engine lifecycle method
    update (dt) {
        // console.log('asdasd', dt);
    }

    // Engine lifecycle method
    render (ctx) {
        ctx.save();
        ctx.fillStyle = this.isHovered ? 'purple' : 'lime';
        ctx.globalAlpha = this.#lives / this.#initialLives;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1;
        ctx.restore();
    }
}