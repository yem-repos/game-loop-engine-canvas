export class Entity {
    x = 0;
    y = 0;
    width = 32;
    height = 32;
    isHovered = false;
    isDragging = false;
    sceneAPI = null;
    store = null;
    cursor = 'default';
    destroyed = false;

    // On Added
    onAdded(sceneAPI) {
        this.sceneAPI = sceneAPI;
        this.store = sceneAPI.getStore();
    }

    // Destroy
    destroy () {
        this.destroyed = true;
    }

    // Hit detection
    contains(x, y) {
        return (
            x >= this.x && 
            x <= this.x + this.width && 
            y >= this.y && 
            y <= this.y + this.height
        );
    }

    // Mouse API (optional overrides)
    onMouseEnter(mouse) {}
    onMouseOver(mouse) {}
    onMouseJustPressed(mouse) {}
    onMouseHold(mouse) {}
    onMouseDrag(mouse) {}
    onMouseJustReleased(mouse) {}
    onMouseLeave(mouse) {}

    // Update
    update (dt) {}

    // Render
    render (ctx) {}
}