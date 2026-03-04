export class Scene {
    #entities = [];
    #gameAPI = null;

    // Scene API
    #api = {
        add: (entity) => this.add(entity),
        getSize: () => this.#gameAPI.getSize(),
        getStore: () => this.#gameAPI.getStore(),

        // Game states
        startGame: () => this.#gameAPI.startGame(),
        pauseGame: () => this.#gameAPI.pauseGame(),
        resumeGame: () => this.#gameAPI.resumeGame(),
        gameOver: () => this.#gameAPI.gameOver(),
        goToMenu: () => this.#gameAPI.goToMenu()
    };

    constructor (...entities) {
        for (const entity of entities) {
            this.add(entity);
        }
    }

    // Add entity
    add (entity) {
        this.#validateEntity(entity);
        this.#entities.push(entity);

        if (this.#gameAPI) {
            entity.onAdded(this.#api);
        }
    }

    // Validate entity
    #validateEntity (entity) {

        // Entity is required
        if (!entity) {
            throw new Error('entity is required');
        }

        // Check if entity.update() method exists
        if (typeof entity.update !== 'function') {
            throw new Error('entity must implement update(delta)');
        }

        // Check if entity.render() method exists
        if (typeof entity.render !== 'function') {
            throw new Error('entity must implement render(ctx)');
        }
    }

    // Set game API
    setGameAPI (gameAPI) {
        this.#gameAPI = gameAPI;

        for (const entity of this.#entities) {
            entity.onAdded(this.#api);
        }
    }

    // Handle input
    #handleInput(entity) {
        if (typeof entity.contains !== 'function') return;

        const mouse = this.#gameAPI.getMouse();

        if (!mouse.hasMoved) return;
        const isHit = entity.contains(mouse.x, mouse.y);

        // Enter
        if (isHit === true && entity.isHovered === false && typeof entity.onMouseEnter === 'function') {
            entity.isHovered = true;
            entity.onMouseEnter(mouse);
        }

        // Hover
        if (isHit === true && mouse.isDown === false) {
            entity.onMouseOver?.(mouse);
        }

        // JustPressed
        if (isHit === true && mouse.justPressed === true) {
            entity.isDragging = true;
            entity.onMouseJustPressed?.(mouse);
        }

        // Mouse Hold
        if (isHit === true && mouse.isDown === true) {
            entity.onMouseHold?.(mouse);
        }

        // Mouse Drag
        if (entity.isDragging && mouse.isDown === true && mouse.moved === true) {
            entity.onMouseDrag?.(mouse);
        }

        // Just Released
        if (isHit === true && mouse.justReleased === true) {
            entity.isDragging = false;
            entity.onMouseJustReleased?.(mouse);
        }

        // Leave
        if (isHit === false && entity.isHovered === true && entity.isDragging === false && typeof entity.onMouseLeave === 'function') {
            entity.isHovered = false;
            entity.onMouseLeave(mouse);
        }
        
    }

    // Engine lifecycle method
    update (delta) {
        let cursor = 'default';

        for (const entity of this.#entities) {

            // Input phase
            this.#handleInput(entity);

            // Entity hovered
            if (entity.isHovered && entity.cursor) {
                cursor = entity.cursor;
            }

            // Entity update phase
            entity.update(delta);
        }

        // Set cursor
        this.#gameAPI.setCursor(cursor);

        // Cleanup phase
        this.#entities = this.#entities.filter(e => !e.destroyed);
    }

    // Engine lifecycle method
    render (ctx) {
        for (const entity of this.#entities) {
            entity.render(ctx);
        }
    }
}