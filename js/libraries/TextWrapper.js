export default class TextWrapper {
	constructor() {
		this.margin = {left: 8, right: 8}
		this.padding = {top:4, left: 8, bottom: 4, right: 8}
		this.fontSize = 24
	}
	draw(ctx, text, options) {
		let width = options.width
		let line = 0;
		text.split("\n").forEach(textLine => {
			while (this.textIsTooLong(ctx, textLine, width)) {
				let shortTextIndex = this.getShortTextIndex(ctx, textLine, width)
				let shortText = textLine.substr(0, shortTextIndex).trim()
				textLine = textLine.substr(shortTextIndex)
				this.drawTextLine(ctx, shortText, line)
				line++;
			}
	
			this.drawTextLine(ctx, textLine.trim(), line)
			line++
		})
		
	}

	drawTextLine(ctx, text, line) {
		let bounds = ctx.measureText(text);
		let textHeight = Math.max(Math.ceil(this.fontSize), bounds.actualBoundingBoxAscent + bounds.actualBoundingBoxDescent);
		ctx.fillText(text, this.padding.left, this.padding.top + (line * textHeight));
	}

	getShortTextIndex(ctx, text, width) {
		let timeout = 0
		while (this.textIsTooLong(ctx, text, width)) {
			timeout++
			let words = text.split(" ");
			words.pop();
			text = words.join(" ");
			if(timeout > 50) {
				throw new Error(`Text won't fit in ${width}`)
			}
		}
		return text.length;
	}

	textIsTooLong(ctx, text, width) {
		let bounds = ctx.measureText(text);
		let areaWidth = width - (this.padding.left + this.padding.right + this.margin.left + this.margin.right);
		return bounds.width > areaWidth
	}
}