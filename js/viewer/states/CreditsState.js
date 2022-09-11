import { Camera } from "../../libraries/Camera.js";
import { Point } from "../../libraries/spatial/Point.js";
import { Theme } from "../../libraries/components/Theme.js"
import TextWrapper from "../../libraries/TextWrapper.js";
import { Picture } from "../../libraries/CanvasArtist.js";

export class CreditsState {
	constructor(view) {
		this.stateMachine = view.stateMachine
		this.camera = new Camera()
		this.camera.scale = new Point(1, 1)

		this.textWrapper = new TextWrapper()
		this.headerFontSize = 48
		this.normalFontSize = 24
		this.debounce = 50
	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.bounds
	}

	draw(ctx, scaledCanvas) {
		
		this.camera.draw(ctx, scaledCanvas, () => {
			ctx.fillStyle = Theme.Colors.ivory
			ctx.font = `${this.headerFontSize}px ${Theme.Fonts.Header}`
			ctx.textAlign = "center"
			this.textWrapper.fontSize = this.headerFontSize
			this.textWrapper.draw(ctx, `You Found
			The Diamond!`, {width: this.canvasBounds.width})
			ctx.save()
			ctx.translate(0, this.headerFontSize * 2)
			this.textWrapper.fontSize = this.normalFontSize
			ctx.font = `${this.normalFontSize}px ${Theme.Fonts.Header}`
			this.textWrapper.draw(ctx, `Developed By
			
			Midas
			and
			Nusha


			Thanks for Playing!

			js13k Games 2022 Entry
			`, {width: this.canvasBounds.width})
			ctx.restore()

			ctx.save()
			ctx.translate(-Theme.Game.TileSize.width /2, 400)
			Picture.Diamond(ctx, {width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height * 0.8})
			ctx.restore()
		})

		// this.playButton.setPosition(this.canvasBounds.width / 2, this.canvasBounds.height * (7 / 8))
		// this.playButton.draw(ctx, scaledCanvas)
	}

	update(delta) {
		if(this.debounce > 0) {
			this.debounce--
		}

		this.camera.targetPosition.y = (this.canvasBounds.height / 2) - 100
		let fontScale = this.canvasBounds.width / 500
		this.headerFontSize = Math.min(Math.floor(48 * fontScale), 48)
		this.normalFontSize = Math.min(Math.floor(24 * fontScale), 24)
		this.camera.update(delta)

		if(!this.ending && this.camera.position.equals(this.camera.targetPosition)) {
			this.ending = true
			this.endWait = setTimeout(() => {
				this.stateMachine.transitionTo("mainmenu")
			}, 8000)
		}
	}

	enter() {
		this.registeredEvents = {}
		this.registeredEvents["keyup"] = this.onKeyUp.bind(this)
		this.registeredEvents["mouseup"] = this.onMouseUp.bind(this)

		for (let index in this.registeredEvents) {
			window.addEventListener(index, this.registeredEvents[index])
		}

		this.debounce = 50
		this.camera.targetPosition.y = 500
		this.camera.position.y = -500
	}
	leave() {
		for (let index in this.registeredEvents) {
			window.removeEventListener(index, this.registeredEvents[index])
		}

		clearTimeout(this.endWait)
	}

	onKeyUp(event) {
		if(this.debounce > 0) {
			return
		}
		this.stateMachine.transitionTo("mainmenu")
	}

	onMouseUp(event) {
		if(this.debounce > 0) {
			return
		}
		this.stateMachine.transitionTo("mainmenu")
	}
}
