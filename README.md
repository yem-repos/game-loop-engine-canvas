# GameLoop Canvas

A minimal canvas game engine built from scratch.

## Features:
- Game loop using requestAnimationFrame
- Scene / Entity architecture
- Input system (hover, drag, press)
- Scene API and Game API separation
- Store-based game state
- HUD rendering

## Architecture
    Game
    ├ Scene
    │  ├ Spawner
    │  ├ Item
    │  └ Hud
    └ Store

This project demonstrates the architecture of a simple canvas game engine without external libraries.