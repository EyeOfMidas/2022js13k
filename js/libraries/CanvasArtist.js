export var Picture = {}
Picture.Bone = function (ctx, options) {
	let width = options.width
	let height = options.height
	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(2 * width / 8, 7 * height / 8, width/16, 0, 2 * Math.PI)
	ctx.fill()
	ctx.beginPath()
	ctx.arc(1 * width / 8, 6 * height / 8, width/16, 0, 2 * Math.PI)
	ctx.fill()

	ctx.beginPath()
	ctx.arc(7 * width / 8, 2 * height / 8, width/16, 0, 2 * Math.PI)
	ctx.fill()
	ctx.beginPath()
	ctx.arc(6 * width / 8, 1 * height / 8, width/16, 0, 2 * Math.PI)
	ctx.fill()
	ctx.beginPath()
	ctx.moveTo(2 * width / 8 - 2, 7 * height / 8)
	ctx.lineTo(7 * width / 8 - 2, 2 * height / 8)
	ctx.lineTo(6 * width / 8 + 2, 1 * height / 8)
	ctx.lineTo(1 * width / 8 + 2, 6 * height / 8)
	ctx.closePath()
	ctx.fill()

}
Picture.DashHead = function (ctx, options) {
	ctx.fillStyle = "#272935"
	ctx.beginPath()
	ctx.moveTo(-5, -27)
	ctx.lineTo(30, -23)
	ctx.lineTo(10, 23)
	ctx.lineTo(3, 20)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "#31333F"
	ctx.beginPath()
	ctx.arc(0, 0, 25, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.ellipse(12, -8, 4, 8, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(13, -9, 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "#31333F"
	ctx.beginPath()
	ctx.moveTo(0, -9)
	ctx.lineTo(20, -7)
	ctx.lineTo(35, -2)
	ctx.arc(35, 8, 10, -Math.PI / 2, Math.PI / 2)
	ctx.lineTo(0, 20)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.arc(35, 8, 10, -Math.PI / 2, 0)
	ctx.lineTo(35, 5)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.ellipse(-4, -8, 4, 8, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(-3, -8, 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "#BC6439"
	ctx.beginPath()
	ctx.moveTo(20, 9)
	ctx.lineTo(40, 10)
	ctx.arc(35, 8, 10, Math.PI / 8, Math.PI / 2)
	ctx.lineTo(4, 20)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "#3A3C4A"
	ctx.beginPath()
	ctx.moveTo(-35, -24)
	ctx.lineTo(0, -27)
	ctx.lineTo(-20, 23)
	ctx.lineTo(-27, 20)
	ctx.closePath()
	ctx.fill()
}

Picture.DogHead1 = function (ctx, options) {
	ctx.fillStyle = "#AC5429"
	ctx.beginPath()
	ctx.moveTo(-5, -27)
	ctx.lineTo(30, -23)
	ctx.lineTo(10, 23)
	ctx.lineTo(3, 20)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "#BC6439"
	ctx.beginPath()
	ctx.arc(0, 0, 25, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.ellipse(12, -8, 4, 8, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(13, -9, 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "#BC6439"
	ctx.beginPath()
	ctx.moveTo(0, -9)
	ctx.lineTo(10, -7)
	ctx.lineTo(25, -2)
	ctx.arc(25, 8, 10, -Math.PI / 2, Math.PI / 2)
	ctx.lineTo(3, 25)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.arc(25, 8, 10, -Math.PI / 2, 0)
	ctx.lineTo(25, 5)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.ellipse(-4, -8, 4, 8, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(-3, -8, 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "#CC7449"
	ctx.beginPath()
	ctx.moveTo(-35, -24)
	ctx.lineTo(0, -27)
	ctx.lineTo(-20, 23)
	ctx.lineTo(-27, 20)
	ctx.closePath()
	ctx.fill()
}

Picture.DogHead2 = function (ctx, options) {
	ctx.fillStyle = "rgb(91, 80, 68)"
	ctx.beginPath()
	ctx.moveTo(-5, -27)
	ctx.lineTo(30, -23)
	ctx.lineTo(10, 23)
	ctx.lineTo(3, 20)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "rgb(245, 251, 239)"
	ctx.beginPath()
	ctx.arc(0, 0, 25, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.ellipse(12, -8, 4, 8, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(13, -9, 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "rgb(245, 251, 239)"
	ctx.beginPath()
	ctx.moveTo(0, -9)
	ctx.lineTo(10, -7)
	ctx.lineTo(25, -2)
	ctx.arc(25, 8, 10, -Math.PI / 2, Math.PI / 2)
	ctx.lineTo(3, 25)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "rgb(107, 96, 84)"
	ctx.beginPath()
	ctx.arc(7, 0, 4, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "rgb(107, 96, 84)"
	ctx.beginPath()
	ctx.arc(7, 20, 8, 3 * Math.PI / 4, Math.PI / 12)
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.arc(25, 8, 10, -Math.PI / 2, 0)
	ctx.lineTo(25, 5)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.ellipse(-4, -8, 4, 8, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(-3, -8, 2, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "rgb(123, 112, 100)"
	ctx.beginPath()
	ctx.moveTo(-35, -24)
	ctx.lineTo(0, -27)
	ctx.lineTo(-20, 23)
	ctx.lineTo(-27, 20)
	ctx.closePath()
	ctx.fill()
}

Picture.DirtBlock = function (ctx, options) {
	let width = options.width
	let height = options.height
	ctx.fillStyle = "#823c0a"
	ctx.roundRect(0, 0, width, height, 8)
	ctx.fill()

	ctx.strokeStyle = "#82540a"
	ctx.roundRect(0, 0, width - 2, height - 2, 8)
	ctx.stroke()

	ctx.fillStyle = "#82540a"
	ctx.roundRect(3 * width / 8, 2 * height / 8, 2 * width / 8, 1 * height / 8, 8)
	ctx.fill()
	ctx.fillStyle = "#82540a"
	ctx.roundRect(4 * width / 8 + 1, 3 * height / 8 + 1, 2 * width / 8, 1 * height / 8, 8)
	ctx.fill()
}

Picture.GrassBlock = function (ctx, options) {
	let width = options.width
	let height = options.height
	Picture.DirtBlock(ctx, { width, height })

	ctx.fillStyle = "#167a04"
	ctx.roundRect(0, 0, width, height / 6, 8)
	ctx.fill()

	ctx.fillStyle = "#517a04"
	ctx.beginPath()
	ctx.moveTo(5 * width / 8, 0)
	ctx.lineTo(7 * width / 8, 0)
	ctx.lineTo(6 * width / 8, height / 6)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.moveTo(1 * width / 8, 0)
	ctx.lineTo(3 * width / 8, 0)
	ctx.lineTo(2 * width / 8, height / 6)
	ctx.closePath()
	ctx.fill()

	ctx.beginPath()
	ctx.moveTo(3 * width / 8, height / 6)
	ctx.lineTo(5 * width / 8, height / 6)
	ctx.lineTo(4 * width / 8, 0)
	ctx.closePath()
	ctx.fill()

	ctx.strokeStyle = "#517a04"
	ctx.roundRect(0, 0, width, height / 6, 8)
	ctx.stroke()
}

Picture.DirtBoneBlock = function (ctx, options) {
	let width = options.width
	let height = options.height
	Picture.DirtBlock(ctx, { width, height })
	Picture.Bone(ctx, { width, height })
}

Picture.Cameo = function(ctx, options) {
	let width = options.width

	var grd = ctx.createLinearGradient(0, 0, 0, 150);
	grd.addColorStop(0, "#573815");
	grd.addColorStop(1, "#261e15");
	
	ctx.fillStyle = grd
	ctx.beginPath()
	ctx.ellipse(0,0, width, width * 1.25, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.fillStyle = "#494949"
	ctx.beginPath()
	ctx.ellipse(0,0, width * 0.9, (width * 1.25)* 0.9, 0, 0, 2 * Math.PI)
	ctx.fill()

	ctx.save()
	ctx.scale(2, 2)
	Picture.DashHead(ctx, {})
	ctx.restore()
}

Picture.DigPlayer = function(ctx, options) {
	ctx.fillStyle = "#3A3C4A"
	ctx.beginPath()
	ctx.arc(-6, 0, 8, Math.PI, (3 * Math.PI) / 2)
	ctx.lineTo(6, -8)
	ctx.arc(6, 0, 8, (3 * Math.PI) / 2, 2 * Math.PI)
	ctx.lineTo(18, 28)
	ctx.lineTo(-18, 28)
	ctx.closePath()
	ctx.fill()

	ctx.save()
	ctx.translate(0, -16)
	ctx.scale(0.7, 0.7)
	Picture.DashHead(ctx, options)
	ctx.restore()
}

Picture.Skull = function(ctx, options) {
	let width = options.width
	let height = options.height
	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.arc(0,0, width/ 3, 0, 2 * Math.PI)
	ctx.fill()

	ctx.beginPath()
	ctx.roundRect(-width/12,height/8,width /3, height /3,2)
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.beginPath()
	ctx.arc(0,0,6,0, 2 * Math.PI)
	ctx.fill()

	ctx.beginPath()
	ctx.arc(width/4,0,6,0, 2 * Math.PI)
	ctx.fill()

	ctx.strokeStyle = "black"
	ctx.beginPath()
	ctx.moveTo(0,0.3 * height)
	ctx.lineTo(0, 0.45 * height)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(0.1 * width,0.3 * height)
	ctx.lineTo(0.1 * width, 0.45 * height)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(0.2 * width,0.3 * height)
	ctx.lineTo(0.2 * width, 0.45 * height)
	ctx.stroke()

	ctx.beginPath()
	ctx.moveTo(0.13 * width,0.1* height)
	ctx.lineTo(0.18 * width, 0.2* height)
	ctx.lineTo(0.08 * width, 0.2* height)
	ctx.closePath()
	ctx.stroke()
}

Picture.DirtSkullBlock = function (ctx, options) {
	let width = options.width
	let height = options.height
	Picture.DirtBlock(ctx, { width, height })
	ctx.save()
	ctx.translate(width / 2, height /2)
	Picture.Skull(ctx, { width, height })
	ctx.restore()
}

Picture.Shovel = function(ctx, options) {
	let width = options.width
	let height = options.height

	ctx.fillStyle = "#823c0a"
	ctx.strokeStyle = "#823c0a"
	ctx.lineCap = "round"
	ctx.lineWidth = 4

	ctx.beginPath()
	ctx.moveTo(1/8 * width, 7/8 * height)
	ctx.lineTo(4/8 * width, 4/8 * height)
	ctx.stroke()

	ctx.fillStyle="gray"

	ctx.beginPath()
	ctx.moveTo(7/8 * width, 3/8* height)
	ctx.lineTo(5/8 * width, 5/8* height)
	ctx.lineTo(3/8* width, 3/8 * height)
	ctx.lineTo(5/8 * width, 1/8* height)
	ctx.arc(5/8 * width, 3/8 * height, 2/8 * width, -Math.PI /2, 0)
	ctx.closePath()
	ctx.fill()
}

Picture.Tombstone = function(ctx, options) {
	let width = options.width
	let height = options.height

	ctx.fillStyle="gray"

	ctx.beginPath()
	ctx.moveTo(6/8 * width, 3/8* height)
	ctx.lineTo(6/8 * width, 7/8* height)
	ctx.lineTo(2/8* width, 7/8 * height)
	ctx.lineTo(2/8 * width, 3/8* height)
	ctx.arc(4/8 * width, 3/8 * height, 2/8 * width, -Math.PI, 0)
	ctx.closePath()
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.font = `14px sans-serif`
	ctx.textAlign = "center"
	ctx.fillText("xxx", 4/8 * width, 4/8 * height)
}

Picture.Diamond = function(ctx, options) {
	let width = options.width
	let height = options.height

	ctx.fillStyle = "#B4FFFD"
	ctx.beginPath()
	ctx.moveTo(2/8 * width, 3/8 * height)
	ctx.lineTo(3/8 * width, 1/8 * height)
	ctx.lineTo(4/8 * width, 3/8 * height)
	ctx.fill()


	ctx.fillStyle = "white"
	ctx.beginPath()
	ctx.moveTo(3/8 * width, 1/8 * height)
	ctx.lineTo((4.5)/8 * width, 1/8 * height)
	ctx.lineTo(4/8 * width, 3/8 * height)
	ctx.fill()

	ctx.fillStyle = "#4898B8"
	ctx.beginPath()
	ctx.moveTo((4.5)/8 * width, 1/8 * height)
	ctx.lineTo(5/8 * width, 3/8 * height)
	ctx.lineTo(4/8 * width, 3/8 * height)
	ctx.fill()

	ctx.fillStyle = "#B4FFFD"
	ctx.beginPath()
	ctx.moveTo((4.5)/8 * width, 1/8 * height)
	ctx.lineTo(6/8 * width, 1/8 * height)
	ctx.lineTo(5/8 * width, 3/8 * height)
	ctx.fill()

	ctx.fillStyle = "#61CAFB"
	ctx.beginPath()
	ctx.moveTo(6/8 * width, 1/8 * height)
	ctx.lineTo(7/8 * width, 3/8 * height)
	ctx.lineTo(5/8 * width, 3/8 * height)
	ctx.fill()

	ctx.fillStyle = "#B4FFFD"
	ctx.beginPath()
	ctx.moveTo(5/8 * width, 3/8 * height)
	ctx.lineTo(7/8 * width, 3/8 * height)
	ctx.lineTo((4.5)/8 * width, 6/8 * height)
	ctx.fill()


	ctx.fillStyle = "#61CAFB"
	ctx.beginPath()
	ctx.moveTo(5/8 * width, 3/8 * height)
	ctx.lineTo((4.5)/8 * width, 6/8 * height)
	ctx.lineTo(4/8 * width, 3/8 * height)
	ctx.fill()

	ctx.fillStyle = "#4898B8"
	ctx.beginPath()
	ctx.moveTo(4/8 * width, 3/8 * height)
	ctx.lineTo((4.5)/8 * width, 6/8 * height)
	ctx.lineTo(2/8 * width, 3/8 * height)
	ctx.fill()

}

Picture.DirtDiamondBlock = function (ctx, options) {
	let width = options.width
	let height = options.height
	Picture.DirtBlock(ctx, { width, height })
	ctx.save()
	ctx.translate(-1/12 * width, height / 6)
	Picture.Diamond(ctx, { width, height: height * 0.8 })
	ctx.restore()
}
