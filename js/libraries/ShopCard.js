import { Picture } from "./CanvasArtist.js"
import { Theme } from "./components/Theme.js"
import { Point } from "./spatial/Point.js"
import TextWrapper from "./TextWrapper.js"
import "./ShufflePolyfill.js"

export default class ShopCard {
	constructor() {
		this.textWrapper = new TextWrapper()
		this.init()
	}

	init() {
		this.generateRequest()
	}

	generateRequest() {
		this.availableItems = ["bones", "skulls", "bones", "bones", "bones"]
		this.item = this.availableItems.shuffle().pop()

		switch(this.item) {
		case "bones": 
			this.generateBonesRequest()
			break
		case "skulls":
			this.generateSkullsRequest()
			break;
		}
	}

	generateBonesRequest() {
		this.amount = Math.floor(4 * Math.random()) + 3
		this.rate = Math.floor((500 * Math.random() + 100)/100)
		let options =[
			`I need ${this.amount} bones so I can bury them for my family. My family loves bones!`,
			`Do you think I could get ${this.amount} bones?`,
			`I only need ${this.amount}; do you have any extra bones I can have?`,
			`I really need some fresh bones! I need ${this.amount} immediately!`
		]

		this.message = options.shuffle()[0]
		let availableCustomers = [Picture.DogHead1, Picture.DogHead2]
		this.customerPicture = availableCustomers.shuffle().pop()
	}

	generateSkullsRequest() {
		this.amount = Math.floor(4 * Math.random()) + 1
		this.rate = Math.floor((5000 * Math.random() + 1000)/100)
		let options =[
			`Did you see those skulls? I must get my hands on ${this.amount} of them!`,
			`I only wish for ${this.amount} skulls.`,
			`Do you take cash? I heard you have ${this.amount} skulls for sale...`,
			`Skulls are tres chique right now. Give me ${this.amount} immediately!`
		]

		this.message = options.shuffle()[0]
		let availableCustomers = [Picture.DogHead1, Picture.DogHead2]
		this.customerPicture = availableCustomers.shuffle().pop()
	}

	update(delta, canvasBounds) {
		this.canvasBounds = canvasBounds
		this.cardHeight = Math.max(this.canvasBounds.height / 6, 100)
		this.fontScale = this.canvasBounds.width / 500
		this.screenWidth = this.canvasBounds.width
	}

	draw(ctx, options) {
		let textFontSize = Math.min(Math.floor(24 * this.fontScale), 24)
		ctx.strokeStyle = Theme.Colors.black
		ctx.lineWidth = 1
		ctx.fillStyle = Theme.Colors.umber
		ctx.beginPath()
		ctx.roundRect(8, 0, this.screenWidth - 16, this.cardHeight, 8)
		ctx.fill()

		ctx.fillStyle = Theme.Colors.seagreen
		if(this.hovered) {
			ctx.fillStyle = Theme.Colors.ivory
		}
		ctx.beginPath()
		ctx.arc(this.screenWidth - (16 + this.cardHeight / 4), 2 * this.cardHeight / 4, this.cardHeight / 4, 0, 2 * Math.PI)
		ctx.fill()

		ctx.font = `${textFontSize}px ${Theme.Fonts.Header}`
        ctx.textAlign = "center"
		ctx.fillStyle = Theme.Colors.ivory
		if(this.hovered) {
			ctx.fillStyle = Theme.Colors.seagreen
		}
		ctx.fillText(`$${this.amount * this.rate}`, this.screenWidth - (16 + this.cardHeight / 4), 2 * (this.cardHeight / 4) + textFontSize / 4)

		ctx.fillStyle = Theme.Colors.umber
		ctx.beginPath()
		ctx.roundRect(16, 8, 9 * this.cardHeight / 12, this.cardHeight - 16, 8)
		ctx.fill()

		ctx.save()
		ctx.translate(16 + (9 * this.cardHeight / 12) / 2, ((this.cardHeight - 16) / 2))
		this.customerPicture(ctx, {})
		ctx.restore()

		ctx.fillStyle = Theme.Colors.ivory
		ctx.font = `${textFontSize}px ${Theme.Fonts.Header}`
		ctx.textAlign = "left"
		ctx.save()
		ctx.translate(32 + (9 * this.cardHeight / 12), 8 + textFontSize)
		this.textWrapper.draw(ctx, this.message, { width: this.screenWidth - (16 + this.cardHeight / 4) - 32 - (9 * this.cardHeight / 12) })
		ctx.restore()
	}

	mouseMove(event, cardOffset) {

		let mousePoint = new Point(
		event.clientX,
		event.clientY,
		)
	
		this.hovered = false
		if(mousePoint.distanceTo(new Point(this.screenWidth - (16 + this.cardHeight / 4), (2 * this.cardHeight / 4) + cardOffset)) < this.cardHeight / 4) {
			this.hovered = true
			document.body.style.cursor = "pointer"
		}
	}

	onClick(handle) {
		if(this.hovered) {
			handle(this.item, this.rate, this.amount)
		}
	}
}