import { FiniteStateMachine } from "../libraries/FiniteStateMachine.js";
import { MainMenuState, DigState, UpgradeState, ShopState, CreditsState, StoryUpdateState } from "./states/index.js";

export class GameView {
    constructor(viewElement) {
        this.element = viewElement
        this.stateMachine = new FiniteStateMachine();
        this.stateMachine.registerState("mainmenu", new MainMenuState(this))
        this.stateMachine.registerState("storyupdate", new StoryUpdateState(this))
        this.stateMachine.registerState("dig", new DigState(this))
        this.stateMachine.registerState("upgrade", new UpgradeState(this))
        this.stateMachine.registerState("shop", new ShopState(this))
        this.stateMachine.registerState("credits", new CreditsState(this))
    }
    async init(scaledCanvas) {
        this.stateMachine.getAllStates().forEach(state => { state.init(scaledCanvas) })
        this.stateMachine.setCurrentState("mainmenu");
        this.scaledCanvas = scaledCanvas
        this.stateMachine.getCurrentState().enter();
    }

    draw(ctx, scaledCanvas) {
        this.stateMachine.getCurrentState().draw(ctx, scaledCanvas);
    }

    update(delta) {
        this.stateMachine.getCurrentState().update(delta);
    }
}
