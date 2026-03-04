import { Game } from "./Core/Game.js";
import { Scene } from "./Core/Scene.js";
import { Item } from "./Entities/Item.js";
import { Spawner } from "./Entities/Spawner.js";
import { Hud } from "./Entities/Hud.js";
import { Store } from "./Store/Store.js";

// Game
const canvas = document.getElementById('canvas');
const game = new Game(
    canvas, 
    new Scene(
        
        // Add Item
        new Item(64, 64), 
        
        // Add Spawner with some logic
        new Spawner(800-64, 0, (mouse, sceneAPI) => {
            // console.log('click', sceneAPI.add);
            const { width, height } = sceneAPI.getSize();
            
            sceneAPI.add(new Item(
                Math.floor(Math.random() * (width - 32+1)), 
                Math.floor(Math.random() * (height - 32+1)), 
            ));
        }),

        // Game HUD
        new Hud()
    ),
    new Store()
);

game.init();
game.init(); // Ignored
console.log(game);
