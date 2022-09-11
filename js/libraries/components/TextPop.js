import { Point } from "../spatial/Point.js";
import { Easing, Tween } from "../Tween.js";
import { Theme } from "../../libraries/components/Theme.js"

export class TextPop {
	constructor(tweenManager, text, pos, startDelay) {
		this.tweenManager = tweenManager
		this.position = pos
		this.alpha = 0
		this.text = text
		this.isCompleted = false
		setTimeout(() => {
			this.alpha = 1
			this.tweenManager.add(new Tween(this, { position: { y: this.position.y - 60 }, alpha: 0 }, 1000, Easing.Linear.EaseNone, () => {
				this.isCompleted = true
			}))
		}, startDelay)
	}

	draw(ctx, scaledCanvas) {
		ctx.fillStyle = Theme.Colors.darkgreen.replace(")", `,${this.alpha})`)
		ctx.font = `36px Arial`
		ctx.textAlign = "center"
		ctx.save()
		ctx.translate(this.position.x, this.position.y)
		ctx.fillText(this.text, 0, 0)
		ctx.restore()
	}

	update(delta) {

	}
}