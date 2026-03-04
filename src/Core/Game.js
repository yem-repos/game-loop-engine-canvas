export class Game {
    #canvas = null;
    #ctx = null;
    #scene = null;
    #isRunning = false;
    #lastTime = 0;
    #mouse = { 
        x: 0, 
        y: 0, 

        justPressed: false,  // One-time flag
        justReleased: false, // One-time flag
        moved: false,        // One-time flag

        isDown: false, 
        hasMoved: false,
        startX: 0, 
        startY: 0
    };
    #cursor = 'default';
    #state = 'menu'; // menu | running | paused | gameover
    #store = null;

    // Game API
    #api = {
        getMouse: () => this.#mouse,
        getSize: () => ({
            width: this.#canvas.width / (window.devicePixelRatio || 1), 
            height: this.#canvas.height / (window.devicePixelRatio || 1)
        }),
        setCursor: (cursor) => {
            if (cursor !== this.#cursor) {
                this.#canvas.style.cursor = cursor;
                this.#cursor = cursor;
            }
        },
        getStore: () => this.#store,

        // Game states
        startGame: () => this.#startGame(),
        pauseGame: () => this.#pauseGame(),
        resumeGame: () => this.#resumeGame(),
        gameOver: () => this.#gameOver(),
        goToMenu: () => this.#goToMenu()
    };

    constructor (canvas, scene, store) {
        this.#canvas = canvas;
        this.#scene = scene;
        this.#store = store;
        this.#validate();

        this.#ctx = this.#canvas.getContext('2d');

        this.#applyDevicePixelRatio();
        this.#registerEvents();

        // Set game API to scene
        this.#scene.setGameAPI(this.#api);
    }

    // Game states
    #startGame () { 
        this.#state = 'running';
    }
    #pauseGame () {
        this.#state = 'paused';
    }
    #resumeGame () {
        this.#state = 'running';
    }
    #gameOver () {
        this.#state = 'gameover';
    }
    #goToMenu () {
        this.#state = 'menu';
    }

    // Validate
    #validate () {
        
        // Canvas
        if (!this.#canvas) {
            throw new Error('<canvas /> is required');
        }

        // Scene
        if (!this.#scene) {
            throw new Error('scene is required');
        }

        // Check if scene.update() method exists
        if (typeof this.#scene.update !== 'function') {
            throw new Error('scene must implement update(delta)');
        }

        // Check if scene.render() method exists
        if (typeof this.#scene.render !== 'function') {
            throw new Error('scene must implement render(ctx)');
        }

        // Validate store
        if (this.#store && typeof this.#store.dispatch !== 'function') {
            throw new Error('store must implement dispatch()');
        }
    }

    // Apply device pixel ratio
    #applyDevicePixelRatio () {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.#canvas.getBoundingClientRect();

        this.#canvas.width = rect.width * dpr;
        this.#canvas.height = rect.height * dpr;

        this.#canvas.style.width = rect.width + 'px';
        this.#canvas.style.height = rect.height + 'px';

        this.#ctx.scale(dpr, dpr);
    }

    // Register events
    #registerEvents () {
        const getPos = (e) => {
            const rect = this.#canvas.getBoundingClientRect();
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        };

        // MouseDown
        this.#canvas.addEventListener('mousedown', (e) => {
            const { x, y } = getPos(e);
            this.#mouse.x = x;
            this.#mouse.y = y;
            this.#mouse.justPressed = true;
            this.#mouse.isDown = true;
            this.#mouse.startX = x;
            this.#mouse.startY = y;
        });

        // MouseUp
        this.#canvas.addEventListener('mouseup', (e) => {
            const { x, y } = getPos(e);
            this.#mouse.x = x;
            this.#mouse.y = y;
            this.#mouse.justReleased = true;
            this.#mouse.isDown = false;
        });

        // MouseMove
        this.#canvas.addEventListener('mousemove', (e) => {
            const { x, y } = getPos(e);
            this.#mouse.x = x;
            this.#mouse.y = y;
            this.#mouse.hasMoved = true;
            this.#mouse.moved = true;
        });

        // Resize
        window.addEventListener('resize', () => {
            this.#applyDevicePixelRatio();
        });
    }

    // Init
    init () {
        if (this.#isRunning) return; // Avoid multiple init
        this.#isRunning = true;
        
        // Init game loop
        requestAnimationFrame((time) => { // First frame
            this.#lastTime = time;
            requestAnimationFrame((time) => this.#loop(time));
        });
    }

    // Main loop
    #loop (time) {
        const delta = time - this.#lastTime;
        this.#lastTime = time;

        // Update phase
        this.#update(delta);

        // Reset one-time flags
        this.#mouse.justPressed = false;
        this.#mouse.justReleased = false;
        this.#mouse.moved = false;

        // Render (draw) phase
        this.#render(this.#ctx);

        // console.log('Main loop', delta);

        // Next frame
        requestAnimationFrame((time) => this.#loop(time));
    }

    // Update phase
    #update(delta) {
        this.#scene.update(delta);
    }

    // Render phase
    #render(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.#scene.render(ctx);
    }
}