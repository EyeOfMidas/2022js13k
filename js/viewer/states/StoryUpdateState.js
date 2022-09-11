import { Camera } from "../../libraries/Camera.js";
import { Point } from "../../libraries/spatial/Point.js";
import { Theme } from "../../libraries/components/Theme.js"
import TextWrapper from "../../libraries/TextWrapper.js";
import { DomButton } from "../../libraries/components/DomButton.js";
import { Save } from "../../libraries/Save.js";
import { Picture } from "../../libraries/CanvasArtist.js";

export class StoryUpdateState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.textWrapper = new TextWrapper()
        this.continueButton = new DomButton(50, 50, view.element, "continue")

        this.stageIndex = 0
        this.storyStages = [
            
            {header: "Introduction", text: `You are a gentleman merchant, grave-robbing and selling disreputable goods to the upper class.
            
            After spending your nights gathering materials, sell them to your discerning patrons at high prices.
            
            You seek the legendary blue diamond, buried with one of the world's elite.`},
            {header: "The First Day", text: `Your first night was successful!
            
            You brought your goods to market and are gaining quite the notorious reputation.`},
            {header: "The Pauper's Grounds", text: `Your reputation grows as fast as your coin-purse.
            
            Keep your eyes on the prize and purchase access to better graveyards.
            `},
            {header: "Shady Oaks", text: `Your reputation grows as fast as your coin-purse.
            
            Keep your eyes on the prize and purchase access to better graveyards.
            `},
            {header: "Peaceful Glen", text: `Your reputation grows as fast as your coin-purse.
            
            Keep your eyes on the prize and purchase access to better graveyards.
            `},
            {header: "Guilded Repose", text: `Your reputation grows as fast as your coin-purse.
            
            This burial ground is rumored to contain the blue diamond! Good luck!
            `},
        ]

        this.save = new Save()
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = Theme.Colors.ivory
            let fontSize = Math.min(Math.floor(48 * fontScale), 48)
            ctx.font = `${fontSize}px ${Theme.Fonts.Header}`
            ctx.textAlign = "center"
            ctx.save()
            ctx.translate(0, -(this.canvasBounds.height / 2) + fontSize)
            ctx.fillText(this.storyStages[this.stageIndex].header, 0, 0)
            ctx.restore()

            ctx.fillStyle = Theme.Colors.ivory
            ctx.font = `${Math.min(Math.floor(20 * fontScale), 20)}px ${Theme.Fonts.Header}`
            ctx.save()
            ctx.translate(0, -this.canvasBounds.height /2 + 200)
            ctx.textAlign = "center"
            this.textWrapper.draw(ctx, this.storyStages[this.stageIndex].text, {width: Math.min(this.canvasBounds.width, 600)})
            ctx.restore()

            ctx.save()
            ctx.translate(-55, 100)
            Picture.Diamond(ctx, {width: 100, height: 80})
            ctx.restore()

            ctx.save()
            ctx.translate(0, -this.canvasBounds.height / 2 + 100)
            Picture.DashHead(ctx, {})
            ctx.restore()

            ctx.save()
            ctx.translate(-Math.min(this.canvasBounds.width /4, 200), -this.canvasBounds.height / 2 + 90)
            Picture.Skull(ctx, {width: 80, height: 80})
            ctx.restore()

            ctx.save()
            ctx.translate(Math.min(this.canvasBounds.width /4, 200)- 50, -this.canvasBounds.height / 2 + 60)
            Picture.Bone(ctx, {width: 80, height: 80})
            ctx.restore()
        })

        this.continueButton.setPosition(
			this.canvasBounds.width * (4 / 8),
			this.canvasBounds.height * (7 / 8)
		)
		this.continueButton.draw(ctx, scaledCanvas)
    }

    update(delta) {
        this.camera.update(delta)
        this.continueButton.update(delta)

        if(this.stageIndex > this.storyStages.length - 1) {
            this.stageIndex = 0
        }
    }

    enter() {
        this.registeredEvents = {}
        this.registeredEvents["resize"] = this.onResize.bind(this)
        this.registeredEvents["keydown"] = this.onKeyDown.bind(this)
        this.registeredEvents["keyup"] = this.onKeyUp.bind(this)
        this.registeredEvents["touchstart"] = this.onTouchStart.bind(this)
        this.registeredEvents["touchmove"] = this.onTouchMove.bind(this)
        this.registeredEvents["touchend"] = this.onTouchEnd.bind(this)
        this.registeredEvents["mousedown"] = this.onMouseDown.bind(this)
        this.registeredEvents["mousemove"] = this.onMouseMove.bind(this)
        this.registeredEvents["mouseup"] = this.onMouseUp.bind(this)

        for (let index in this.registeredEvents) {
            window.addEventListener(index, this.registeredEvents[index])
        }

        this.continueButton.attach()
		this.continueButton.onClick(this.goToGame.bind(this))

        this.stageIndex = this.save.getKey('story-stage') == null ? 0 : this.save.getKey('story-stage')

        if(this.save.getKey("graveyard-1") == true && this.save.getKey("story-stage") == 2) {
            this.stageIndex = 3
        }
        if(this.save.getKey("graveyard-2") == true && this.save.getKey("story-stage") == 3) {
            this.stageIndex = 4
        }
        if(this.save.getKey("graveyard-3") == true && this.save.getKey("story-stage") == 4) {
            this.stageIndex = 5
        }
    }
    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }

        this.continueButton.remove()
    }

    goToGame() {
        this.save.setKey("story-stage", this.stageIndex)
        if(this.save.getKey("story-stage") == 1) {
            this.save.setKey("story-stage", 2)
        }
        this.stateMachine.transitionTo("dig")
    }

    onResize() {
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
        switch (event.code) {
			case "Enter":
				this.goToGame()
				break
		}
        
    }

    onTouchStart(event) {
    }

    onTouchMove(event) {
    }

    onTouchEnd(event) {
    }

    onMouseDown(event) {
    }

    onMouseMove(event) {
    }

    onMouseUp(event) {
    }
}
