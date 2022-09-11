import { Camera } from "../../libraries/Camera.js"
import { Point } from "../../libraries/spatial/Point.js"
import { TweenManager} from "../../libraries/Tween.js"
import { DomButton } from "../../libraries/components/DomButton.js"
import { Theme } from "../../libraries/components/Theme.js"
import { Save } from "../../libraries/Save.js"
import { Picture } from "../../libraries/CanvasArtist.js"

export class MainMenuState {
	constructor(view) {
		this.stateMachine = view.stateMachine
		this.canvasBounds = null
		this.camera = new Camera()
		this.camera.scale = new Point(1, 1)
		this.tweenManager = new TweenManager()

		this.registeredEvents = {}

		this.playerPosition = new Point(0, 0)

		this.playButton = new DomButton(50, 50, view.element, "begin")
		this.wasChanged = false
		this.save = new Save()

		this.deleteSaveButton = new DomButton(
			50,
			50,
			view.element,
			"delete save",
			"skipbutton"
		)
	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.bounds
	}

	draw(ctx, scaledCanvas) {
		let fontScale = this.canvasBounds.width / 500

		ctx.fillStyle = Theme.Colors.ivory
		ctx.font = `600 ${Math.min(Math.floor(48 * fontScale), 48)}px ${Theme.Fonts.Header}`
		ctx.textAlign = "center"
		this.camera.draw(ctx, scaledCanvas, () => {
			ctx.save()
			ctx.translate(0, -150)
			this.drawCameo(ctx)
			ctx.restore()

			ctx.fillText("Merchant", 0, -40)
			ctx.fillText("🔸 of 🔸", 0, 0)
			ctx.fillText("DEATH", 0, 40)
		})

		this.playButton.setPosition(
			this.canvasBounds.width * (2 / 4),
			this.canvasBounds.height * (3 / 4)
		)
		this.playButton.draw(ctx, scaledCanvas)

		this.deleteSaveButton.setPosition(
			this.canvasBounds.width * (2 / 4),
			this.canvasBounds.height * (3 / 4) + 100
		)
		this.deleteSaveButton.draw(ctx, scaledCanvas)

		// this.muteButton.setPosition(this.canvasBounds.width * (3 / 4), this.canvasBounds.height * (1 / 8))
		// this.muteButton.draw(ctx, scaledCanvas)
	}

	drawPlayer(ctx) {
		ctx.fillStyle = Theme.Colors.black
		ctx.beginPath()
		ctx.arc(-10, -8, 8, Math.PI, (3 * Math.PI) / 2)
		ctx.lineTo(10, -16)
		ctx.arc(10, -8, 8, (3 * Math.PI) / 2, 2 * Math.PI)
		ctx.lineTo(24, 28)
		ctx.lineTo(-24, 28)
		ctx.closePath()
		ctx.fill()
	}

	drawDashHead(ctx) {
		ctx.save()
		ctx.translate(0, -16)
		ctx.scale(0.7, 0.7)
		Picture.DashHead(ctx, {})

		ctx.restore()
	}

	drawCameo(ctx) {
		Picture.Cameo(ctx, {width: 128})
	}

	update(delta) {
		this.playButton.update(delta)
		this.deleteSaveButton.update(delta)
		// this.muteButton.update(delta)
		this.camera.targetPosition.y = 8 * Math.sin(new Date().getTime() / 500)
		this.camera.update(delta)
		this.tweenManager.update()
	}

	enter() {
		this.registeredEvents["resize"] = this.onResize.bind(this)
		this.registeredEvents["keyup"] = this.onKeyUp.bind(this)

		for (let index in this.registeredEvents) {
			window.addEventListener(index, this.registeredEvents[index])
		}

		this.playButton.attach()
		this.playButton.onClick(this.goToGame.bind(this))

		this.deleteSaveButton.attach()
		this.deleteSaveButton.onClick(this.deleteSave.bind(this))

		// this.muteButton.attach()
		// this.muteButton.onClick(this.mute.bind(this))
	}
	leave() {
		for (let index in this.registeredEvents) {
			window.removeEventListener(index, this.registeredEvents[index])
		}
		this.registeredEvents = {}
		this.tweenManager.clear()
		this.playButton.remove()
		this.deleteSaveButton.remove()
		// this.muteButton.remove()
	}

	onResize() { }

	onKeyUp(event) {
		switch (event.code) {
			case "Enter":
				this.goToGame()
				break
		}
	}

	goToGame() {
		this.stateMachine.transitionTo("storyupdate")
		// this.stateMachine.transitionTo("shop")
	}

	deleteSave() {
		if (confirm("Are you sure you want to delete your save data?")) {
			this.save.delete()
			alert("Save data deleted")
		}
	}

	mute() {
		console.log("mute")
	}
}
