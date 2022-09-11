import { Camera } from "../../libraries/Camera.js";
import { Point } from "../../libraries/spatial/Point.js";
import { Theme } from "../../libraries/components/Theme.js"
import { DomButton } from "../../libraries/components/DomButton.js";
import { Picture } from "../../libraries/CanvasArtist.js";
import UpgradeButton from "../../libraries/UpgradeButton.js";
import { Save } from "../../libraries/Save.js";

export class UpgradeState {
	constructor(view) {
		this.stateMachine = view.stateMachine
		this.camera = new Camera()
		this.camera.scale = new Point(1, 1)

		this.continueButton = new DomButton(50, 50, view.element, "continue", "ContinueButton")
		this.save = new Save()

		this.upgrades = []
	}

	init(scaledCanvas) {
		this.canvasBounds = scaledCanvas.bounds
	}

	draw(ctx, scaledCanvas) {
		let fontScale = this.canvasBounds.width / 500
		let fontSize = Math.min(Math.floor(48 * fontScale), 48)
		this.camera.draw(ctx, scaledCanvas, () => {
			ctx.fillStyle = "gray"
			ctx.beginPath()
			ctx.rect(-this.canvasBounds.width / 2, -this.canvasBounds.height / 2, this.canvasBounds.width, 128)
			ctx.fill()
			ctx.fillStyle = Theme.Colors.ivory
			ctx.font = `${fontSize}px ${Theme.Fonts.Header}`
			ctx.textAlign = "center"
			ctx.fillText("Upgrade", 0, -this.canvasBounds.height / 2 + fontSize + 24)

			ctx.save()
			ctx.translate(- Theme.Game.TileSize.width / 2, -this.canvasBounds.height / 2 + 128 + Theme.Game.TileSize.height - Theme.Game.TileSize.height / 2)


			this.upgrades.forEach((row, index) => {
				ctx.save()
				ctx.translate((index * this.canvasBounds.width / this.upgrades.length) - this.canvasBounds.width / this.upgrades.length, 24)
				this.drawUpgradeRow(ctx, scaledCanvas, row)
				ctx.restore()
			})

			ctx.fillStyle = Theme.Colors.darkgreen
			ctx.textAlign = "right"
			ctx.fillText(`$${this.getDollars()}`, (this.canvasBounds.width / 2) - 48, -48)

			ctx.restore()
		}) //end camera

		this.continueButton.setPosition(this.canvasBounds.width / 2, Math.max(this.canvasBounds.height * (7 / 8), (this.incrementRow()) * 5 + 128))
		this.continueButton.draw(ctx, scaledCanvas)
	}

	getDollars() {
		return this.save.getKey("money")
	}

	incrementRow() {
		return Math.max(this.canvasBounds.height / 7, Theme.Game.TileSize.width + Theme.Game.TileSize.spacing * 4)
	}

	drawUpgradeRow(ctx, scaledCanvas, row) {

		ctx.textAlign = "center"
		ctx.fillStyle = Theme.Colors.ivory
		let fontScale = this.canvasBounds.width / 500
		let fontSize = Math.min(Math.floor(24 * fontScale), 24)
		ctx.font = `${fontSize}px ${Theme.Fonts.Header}`
		ctx.fillText(row.header, Theme.Game.TileSize.width / 2, -fontSize)

		ctx.strokeStyle = Theme.Colors.ivory
		ctx.lineWidth = 4
		ctx.save()
		ctx.translate(Theme.Game.TileSize.width / 2, Theme.Game.TileSize.height / 2)

		for (let index = 0; index < row.length - 1; index++) {
			ctx.beginPath()
			ctx.moveTo(0, this.incrementRow() * index)
			ctx.lineTo(0, this.incrementRow() * (index + 1))
			ctx.stroke()
		}

		ctx.restore()

		row.buttons.forEach((button, index) => {
			ctx.save()
			ctx.translate(0, this.incrementRow() * index)
			button.draw(ctx, scaledCanvas)
			ctx.restore()
		})
	}

	update(delta) {
		this.camera.update(delta)
		this.continueButton.update(delta)
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
		this.continueButton.onClick(() => {
			this.stateMachine.transitionTo("storyupdate")
		})

		this.upgrades = [
			{header: "shovel speed", buttons: [new UpgradeButton(Picture.Shovel, "I", "shovel-1", 10), new UpgradeButton(Picture.Shovel, "II", "shovel-2", 50), new UpgradeButton(Picture.Shovel, "III", "shovel-3", 100)]},
			{header: "bone rarity", buttons: [new UpgradeButton(Picture.Bone, "I", "bone-1", 50), new UpgradeButton(Picture.Bone, "II", "bone-2", 100), new UpgradeButton(Picture.Bone, "III", "bone-3", 200)]},
			{header: "new area", buttons: [new UpgradeButton(Picture.Tombstone, "I", "graveyard-1", 100), new UpgradeButton(Picture.Tombstone, "II", "graveyard-2", 200), new UpgradeButton(Picture.Tombstone, "III", "graveyard-3", 400)]},
		]

		this.upgrades.forEach(row => {
			row.buttons.forEach((button, index) => {
				if (index == 0) {
					button.locked = false
				}
				if (index > 0 && row.buttons[index - 1].upgraded) {
					button.locked = false
				}
			})
		})
	}
	leave() {
		for (let index in this.registeredEvents) {
			window.removeEventListener(index, this.registeredEvents[index])
		}
		this.continueButton.remove()
	}

	onResize() {
	}

	onKeyDown(event) {
	}

	onKeyUp(event) {
		switch (event.code) {
			case "Enter":
				this.stateMachine.transitionTo("dig")
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

		let point = this.camera.screenToWorld(new Point(event.clientX, event.clientY))
		point.offset(new Point(0, (this.canvasBounds.height / 2 - 152) - Theme.Game.TileSize.height))
		document.body.style.cursor = "default"
		this.upgrades.forEach((row, columnIndex) => {
			row.buttons.forEach((button, rowIndex) => {
				button.hovered = false
				let buttonX = (columnIndex * this.canvasBounds.width / this.upgrades.length) - (this.canvasBounds.width / this.upgrades.length) - Theme.Game.TileSize.width / 2
				if (point.x > buttonX && point.x < buttonX + Theme.Game.TileSize.width) {


					let buttonY = (this.incrementRow() * rowIndex) - Theme.Game.TileSize.height / 2
					if (point.y > buttonY && point.y < buttonY + Theme.Game.TileSize.height) {
						document.body.style.cursor = "pointer"
						button.hovered = true
					}
				}
			})
		})
	}

	onMouseUp(event) {
		this.upgrades.forEach((row, columnIndex) => {
			row.buttons.forEach((button, rowIndex) => {
				if (button.hovered) {
					if (button.purchaseUpgrade()) {
						if (row.buttons[rowIndex + 1]) {
							row.buttons[rowIndex + 1].locked = false
						}
					}
				}
			})
		})
	}
}
