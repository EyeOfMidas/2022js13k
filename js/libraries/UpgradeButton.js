import { Theme } from "./components/Theme.js"
import { Save } from "./Save.js"

export default class UpgradeButton {
	constructor(picture, text, value, cost) {
		this.picture = picture
		this.text = text
		this.value = value
		this.cost = cost

		this.locked = true
		this.hovered = false
		this.upgraded = false
		this.save = new Save()

		if(this.save.getKey(this.value)) {
			this.upgraded = true
			this.locked = false
		}
	}
	update(delta) {

	}

	draw(ctx, scaledCanvas) {
		let fontScale = scaledCanvas.bounds.width / 500
		ctx.lineWidth = 4
		ctx.fillStyle = Theme.Colors.lilac
		ctx.strokeStyle = Theme.Colors.lilac

		if (this.locked) {
			ctx.fillStyle = Theme.Colors.umber
			ctx.strokeStyle = Theme.Colors.umber
		}

		if (!this.locked && this.hovered) {
			ctx.fillStyle = Theme.Colors.lilac
			ctx.strokeStyle = Theme.Colors.seagreen
		}

		if (this.upgraded) {
			ctx.fillStyle = Theme.Colors.seagreen
			ctx.strokeStyle = Theme.Colors.seagreen
		}

		ctx.beginPath()
		ctx.roundRect(0, 0, Theme.Game.TileSize.width, Theme.Game.TileSize.height, 8)
		ctx.fill()
		ctx.stroke()

		this.picture(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
		ctx.fillStyle = Theme.Colors.black

		if (!this.locked && this.hovered) {
			ctx.fillStyle = Theme.Colors.seagreen
		}

		if (this.upgraded) {
			ctx.fillStyle = Theme.Colors.ivory
		}
		ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px ${Theme.Fonts.Header}`
		ctx.textAlign = "center"
		ctx.fillText(this.text, Theme.Game.TileSize.width / 2, Theme.Game.TileSize.height - 4)


		if(!this.upgraded) {
			let money = this.save.getKey("money")
			ctx.fillStyle = Theme.Colors.darkgreen
			if(this.cost > money) {
				ctx.fillStyle = Theme.Colors.darkred
			}
			ctx.font = `${Math.min(Math.floor(18 * fontScale), 18)}px ${Theme.Fonts.Header}`
			ctx.textAlign = "center"
			ctx.fillText(`$${this.cost}`, Theme.Game.TileSize.width / 2, 20)
		}
	}

	purchaseUpgrade() {
		if(this.upgraded) {
			return false
		}
		let money = this.save.getKey("money")
		if (money >= this.cost) {
			this.save.incrementKey("money", -this.cost)
			this.upgraded = true
			this.save.setKey(this.value, true)
			return true
		}
		return false
	}

}