import { GameView } from './viewer/GameView.js';
import { CanvasRenderer } from './libraries/CanvasRenderer.js';
document.body.style.backgroundColor = "black"
document.addEventListener("DOMContentLoaded", () => {
    let viewer = document.getElementById('viewer');
    let renderer = new CanvasRenderer();
    let view = new GameView(viewer);
    renderer.init(viewer, view);
    view.init(renderer.scaledCanvas).then(() => {
        renderer.start();
        setInterval(() => { view.update(1000 / 60); }, Math.floor(1000 / 60));
    })
})
