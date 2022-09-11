import { Camera } from "../../libraries/Camera.js"
import { Point } from "../../libraries/spatial/Point.js"
import { Theme } from "../../libraries/components/Theme.js"
import { Easing, TweenManager, Tween } from "../../libraries/Tween.js"
import { Picture } from "../../libraries/CanvasArtist.js"
import { Save } from "../../libraries/Save.js"
import "../../libraries/RoundRectPolyfill.js"


export class DigState {
    constructor(view) {
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)

        this.time = 0
        this.skyColor = [{ r: 14, g: 85, b: 119 }, { r: 6, g: 12, b: 39 }, { r: 6, g: 12, b: 39 }, { r: 6, g: 12, b: 39 }, { r: 36, g: 41, b: 67 }, { r: 228, g: 166, b: 70 }]
        this.lightOffset = 0
        this.playerPosition = new Point(0, 0)
        this.camera.speed = 8

        this.touchStart = new Point(0, 0)
        this.touchEnd = new Point(0, 0)
        this.touchDuration = 0

        this.level = []
        this.levelSize = { width: 20, height: 10, bones: 12, skulls: 3, time: 24000 }

        this.actions = []
        this.hasMoved = false

        this.tweenManager = new TweenManager()
        this.save = new Save()
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    enter() {
        this.registeredEvents = {}
        this.registeredEvents["resize"] = this.onResize.bind(this)
        this.registeredEvents["keydown"] = this.onKeyDown.bind(this)
        this.registeredEvents["keyup"] = this.onKeyUp.bind(this)
        this.registeredEvents["mousedown"] = this.onMouseDown.bind(this)
        this.registeredEvents["mousemove"] = this.onMouseMove.bind(this)
        this.registeredEvents["mouseup"] = this.onMouseUp.bind(this)

        for (let index in this.registeredEvents) {
            window.addEventListener(index, this.registeredEvents[index])
        }

        this.time = 0
        this.lightOffset = 0

        this.level = this.generateLevel()
        this.playerPosition.y = 1
        this.playerPosition.x = 0

        this.camera.targetPosition.x = 0
        this.camera.targetPosition.y = 0
        this.camera.position.x = 0
        this.camera.position.y = 0

        this.level.find(tile => tile[0] == this.playerPosition.x && tile[1] == this.playerPosition.y)[3] = 0


        this.completePosition = new Point(0, -1000)
        this.completeText = "Daybreak!"
        this.isComplete = false

        this.digStrength = 1
        if (this.save.getKey("shovel-1") == true) {
            this.digStrength = 1.5
        }
        if (this.save.getKey("shovel-2")) {
            this.digStrength = 2
        }
        if (this.save.getKey("shovel-3")) {
            this.digStrength = 3
        }
        this.stones = []
        for(let i = 0; i < this.levelSize.width / 5; i++) {
            this.stones.push(Math.floor(this.levelSize.width * Math.random()))
        }
        this.actions = []
    }

    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }
    }

    draw(ctx, scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
        ctx.fillStyle = Theme.Colors.dirtbrown
        ctx.fillRect(0, 0, this.canvasBounds.width, this.canvasBounds.height)

        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.fillStyle = this.computeSkyColor()
            ctx.fillRect(
                -this.levelSize.width * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) * 2,
                (-this.canvasBounds.height / 2) - ((Theme.Game.TileSize.height + Theme.Game.TileSize.spacing) / 2),
                this.levelSize.width * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) * 6,
                this.canvasBounds.height / 2)

            ctx.fillStyle = Theme.Colors.dirtbrown
            ctx.fillRect(-this.canvasBounds.width, 0, this.levelSize.width * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) * 4, this.canvasBounds.height / 2)

            this.stones.forEach((stone) => {
                ctx.save()
                ctx.translate(stone * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) - (Theme.Game.TileSize.width +Theme.Game.TileSize.spacing) / 2, -1.35 * (Theme.Game.TileSize.height + Theme.Game.TileSize.spacing))
                Picture.Tombstone(ctx,{width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height})
                ctx.restore()
            })
            // ctx.save()
            // ctx.translate(this.stone * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) + (Theme.Game.TileSize.width +Theme.Game.TileSize.spacing) / 2, -1.35 * (Theme.Game.TileSize.height + Theme.Game.TileSize.spacing))
            // Picture.Tombstone(ctx,{width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height})
            // ctx.restore()

            ctx.fillStyle = Theme.Colors.grassgreen
            ctx.roundRect(-this.levelSize.width * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) * 2,
                - ((Theme.Game.TileSize.height + Theme.Game.TileSize.spacing) / 2),
                this.levelSize.width * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) * 6,
                10, 8)
            ctx.fill()

            for (let i = 0; i < this.level.length; i++) {
                let data = this.level[i]
                this.drawTile(ctx, data)
            }

            this.drawPlayer(ctx)
        })
        ctx.strokeStyle = Theme.Colors.ivory
        ctx.lineWidth = 2;
        ctx.beginPath()
        ctx.rect(2, 2, this.canvasBounds.width - 4, 8)
        ctx.stroke()

        ctx.fillStyle = Theme.Colors.ivory
        ctx.beginPath()
        ctx.rect(0, 2, (this.canvasBounds.width - 4) * (this.time / (this.levelSize.time - (this.levelSize.time / this.skyColor.length))), 8)
        ctx.fill()
        let fontScale = this.canvasBounds.width / 500


        let inventorySpacing = 0
        for (let i = 0; i < this.getNumberOfGatheredSkulls(); i++) {
            ctx.save()
            ctx.scale(0.4, 0.4)
            ctx.translate(16 + (i * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) + (Theme.Game.TileSize.width / 2)), 32 + (Theme.Game.TileSize.height / 2))
            Picture.Skull(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
            ctx.restore()
            inventorySpacing++
        }

        for (let i = 0; i < this.getNumberOfGatheredBones(); i++) {
            ctx.save()
            ctx.scale(0.4, 0.4)
            ctx.translate(16 + ((i + inventorySpacing) * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing)), 32)
            Picture.Bone(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
            ctx.restore()
        }


        ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px ${Theme.Fonts.Header}`
        ctx.textAlign = "center"
        let metrics = ctx.measureText(this.completeText)
        ctx.fillStyle = Theme.Colors.umber
        ctx.save()
        ctx.translate(this.canvasBounds.width / 2, this.canvasBounds.height / 2)
        ctx.beginPath()
        ctx.roundRect(this.completePosition.x - (metrics.width + 64) / 2, this.completePosition.y - Math.min(Math.floor(48 * fontScale), 48) - 16, metrics.width + 64, Math.min(Math.floor(64 * fontScale), 64) + 32, 8)
        ctx.fill()
        ctx.fillStyle = Theme.Colors.ivory

        ctx.fillText(this.completeText, this.completePosition.x, this.completePosition.y)
        ctx.restore()

    }

    drawPlayer(ctx) {
        ctx.fillStyle = Theme.Colors.ivory
        ctx.save()
        ctx.translate(this.playerPosition.x * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing), this.playerPosition.y * (Theme.Game.TileSize.height + Theme.Game.TileSize.spacing))
        Picture.DigPlayer(ctx, {})
        ctx.restore()
    }

    computeSkyColor() {
        let ratio = (this.time / (this.levelSize.time / this.skyColor.length)) - this.lightOffset
        let r = ratio * (this.skyColor[this.lightOffset + 1].r - this.skyColor[this.lightOffset + 0].r) + this.skyColor[this.lightOffset + 0].r
        let g = ratio * (this.skyColor[this.lightOffset + 1].g - this.skyColor[this.lightOffset + 0].g) + this.skyColor[this.lightOffset + 0].g
        let b = ratio * (this.skyColor[this.lightOffset + 1].b - this.skyColor[this.lightOffset + 0].b) + this.skyColor[this.lightOffset + 0].b
        return `rgb(${r}, ${g}, ${b})`
    }


    drawTile(ctx, tileData) {
        let width = Theme.Game.TileSize.width;
        let height = Theme.Game.TileSize.height;
        let spacing = Theme.Game.TileSize.spacing
        let x = tileData[0]
        let y = tileData[1]
        let type = tileData[2]
        let health = tileData[3]
        let maxHealth = tileData[4]


        ctx.save()
        ctx.translate(x * width - (width / 2) + (x * spacing), y * height - (height / 2) + (y * spacing))
        if (health == 0) {
            ctx.fillStyle = "black"
            ctx.roundRect(-2, -2, width + 2, height + 2, 10)
            ctx.fill()
            ctx.restore()
            return
        }
        switch (type) {
            case "dirt":
                Picture.DirtBlock(ctx, { width, height })
                break;
            case "grass":
                Picture.GrassBlock(ctx, { width, height })
                break
            case "dirt-bones":
                Picture.DirtBoneBlock(ctx, { width, height })
                break
            case "dirt-skull":
                Picture.DirtSkullBlock(ctx, { width, height })
                break
            case "dirt-diamond":
                Picture.DirtDiamondBlock(ctx, { width, height })
                break
        }

        if (health < maxHealth) {
            ctx.fillStyle = Theme.Colors.ivory
            ctx.strokeStyle = Theme.Colors.ivory
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.rect(4, height / 8, width - 8, 6)
            ctx.stroke()

            ctx.beginPath()
            ctx.rect(4, height / 8, width * (health / maxHealth) - 8, 6)
            ctx.fill()
        }
        ctx.restore()
    }

    update(delta) {
        if (!this.isComplete) {
            if (this.time >= this.levelSize.time - (this.levelSize.time / this.skyColor.length)) {
                this.isComplete = true
                this.completeText = "Daybreak!"
                this.tweenManager.add(new Tween(this.completePosition, { y: 0 }, 2000, Easing.Elastic.EaseOut, () => {
                    this.sceneComplete()
                }))

            } else {
                this.time += delta
                this.lightOffset = Math.min(this.skyColor.length - 2, Math.floor(this.time / (this.levelSize.time / this.skyColor.length)))
            }

            if (this.actions.length > 0) {
                let nextAction = this.actions.shift()
                switch (nextAction) {
                    case "up":
                        this.digOrMoveY(-1)
                        break;
                    case "down":
                        this.digOrMoveY(1)
                        break
                    case "left":
                        this.digOrMoveX(-1)
                        break
                    case "right":
                        this.digOrMoveX(1)
                        break;
                }
            }

            if (this.levelSize.diamonds > 0 && this.getNumberOfGatheredDiamonds() == this.levelSize.diamonds) {
                this.isComplete = true
                this.completeText = "Success!"
                this.tweenManager.add(new Tween(this.completePosition, { y: 0 }, 2000, Easing.Elastic.EaseOut, () => {
                    this.sceneComplete()
                }))
            }

            if (this.getNumberOfGatheredBones() == this.levelSize.bones && this.getNumberOfGatheredSkulls() == this.levelSize.skulls) {
                this.isComplete = true
                this.completeText = "Looted!"
                this.tweenManager.add(new Tween(this.completePosition, { y: 0 }, 2000, Easing.Elastic.EaseOut, () => {
                    this.sceneComplete()
                }))
            }
        }
        this.camera.update(delta)
        this.tweenManager.update()
    }

    sceneComplete() {
        this.save.incrementKey("bones", this.getNumberOfGatheredBones())
        this.save.incrementKey("skulls", this.getNumberOfGatheredSkulls())
        this.save.incrementKey("diamonds", this.getNumberOfGatheredDiamonds())
        if (this.save.getKey("diamonds") > 0) {
            this.stateMachine.transitionTo("credits")
        } else {
            this.stateMachine.transitionTo("shop")
        }
    }

    getNumberOfGatheredBones() {
        return this.level.filter(tile => tile[2] == "dirt-bones" && tile[3] == 0).length
    }

    getNumberOfGatheredSkulls() {
        return this.level.filter(tile => tile[2] == "dirt-skull" && tile[3] == 0).length
    }

    getNumberOfGatheredDiamonds() {
        return this.level.filter(tile => tile[2] == "dirt-diamond" && tile[3] == 0).length
    }

    moveX(direction) {
        let playerSpeed = Theme.Game.TileSize.width + Theme.Game.TileSize.spacing
        this.playerPosition.x += direction
        if (this.playerPosition.x < 0) {
            this.playerPosition.x = 0
        }
        if (this.playerPosition.x >= (this.levelSize.width - 1)) {
            this.playerPosition.x = (this.levelSize.width - 1)
        }
        if (this.playerPosition.x * playerSpeed > this.camera.targetPosition.x + this.canvasBounds.width / 4) {
            this.camera.targetPosition.x += playerSpeed * direction
        }

        if (this.playerPosition.x * playerSpeed < this.camera.targetPosition.x + -this.canvasBounds.width / 4) {
            this.camera.targetPosition.x += playerSpeed * direction
        }
    }

    digOrMoveX(direction) {
        let nextTilePosition = { x: this.playerPosition.x + direction, y: this.playerPosition.y }
        let nextTile = this.level.find((tile) => tile[0] == nextTilePosition.x && tile[1] == nextTilePosition.y)
        if (!nextTile) {
            return
        }
        if (nextTile[3] > 0) {
            nextTile[3] = Math.max(0, nextTile[3] - this.digStrength)
            if(nextTile[3] == 0) {
                this.playSound(this.digSound2)
                if(!["dirt", "grass"].includes(nextTile[2])) {
                    this.playSound(this.gatherSound)
                }
            }
        }
        if (nextTile[3] <= 0) {
            this.moveX(direction)
        }
    }


    moveY(direction) {
        let playerSpeed = Theme.Game.TileSize.height + Theme.Game.TileSize.spacing
        this.playerPosition.y += direction
        if (this.playerPosition.y < 0) {
            this.playerPosition.y = 0
        }
        if (this.playerPosition.y >= (this.levelSize.height - 1)) {
            this.playerPosition.y = (this.levelSize.height - 1)
        }
        if (this.playerPosition.y * playerSpeed > this.camera.targetPosition.y + this.canvasBounds.height / 4) {
            this.camera.targetPosition.y += playerSpeed * direction
        }

        if (this.playerPosition.y * playerSpeed < this.camera.targetPosition.y + -this.canvasBounds.height / 4) {
            this.camera.targetPosition.y += playerSpeed * direction
        }
    }

    digOrMoveY(direction) {
        let nextTilePosition = { x: this.playerPosition.x, y: this.playerPosition.y + direction }
        let nextTile = this.level.find((tile) => tile[0] == nextTilePosition.x && tile[1] == nextTilePosition.y)
        if (!nextTile) {
            return
        }
        if (nextTile[3] > 0) {
            nextTile[3] = Math.max(0, nextTile[3] - this.digStrength)
            if(nextTile[3] == 0) {
                this.playSound(this.digSound2)
                if(!["dirt", "grass"].includes(nextTile[2])) {
                    this.playSound(this.gatherSound)
                }
            }
        }
        if (nextTile[3] <= 0) {
            this.moveY(direction)
        }
    }

    generateLevel() {

        this.levelSize = { width: 10, height: 6, bones: 8, skulls: 1, diamonds: 0, time: 24000 }
        if (this.save.getKey("graveyard-1")) {
            this.levelSize = { width: 20, height: 10, bones: 12, skulls: 3, diamonds: 0, time: 24000 }
        }
        if (this.save.getKey("graveyard-2")) {
            this.levelSize = { width: 40, height: 15, bones: 24, skulls: 8, diamonds: 0, time: 24000 }
        }
        if (this.save.getKey("graveyard-3")) {
            this.levelSize = { width: 20, height: 50, bones: 36, skulls: 16, diamonds: 1, time: 24000 }
        }

        let levelArray = []
        for (let y = 0; y < this.levelSize.height; y++) {
            for (let x = 0; x < this.levelSize.width; x++) {
                if (y == 0) {
                    levelArray.push([x, y, "grass", 4, 4])
                } else {
                    levelArray.push([x, y, "dirt", 3, 3])
                }
            }
        }

        if(this.save.getKey("bone-3")) {
            this.levelSize.bones = Math.ceil(2 * this.levelSize.bones)
            this.levelSize.skulls = Math.ceil(2 * this.levelSize.skulls)
        } else if(this.save.getKey("bone-2")) {
            this.levelSize.bones = Math.ceil(1.5 * this.levelSize.bones)
            this.levelSize.skulls = Math.ceil(1.5 * this.levelSize.skulls)
        } else if(this.save.getKey("bone-1")) {
            this.levelSize.bones = Math.ceil(1.2 * this.levelSize.bones)
            this.levelSize.skulls = Math.ceil(1.2 * this.levelSize.skulls)
        }
        
        for (let i = 0; i < this.levelSize.bones; i++) {
            let randomTile = this.getRandomIndex(levelArray, (tile) => tile[1] != 0 && tile[2] != "dirt-bones")
            randomTile[2] = "dirt-bones"
            randomTile[3] = 4
            randomTile[4] = 4
        }

        for (let i = 0; i < this.levelSize.skulls; i++) {
            let randomTile = this.getRandomIndex(levelArray, (tile) => tile[1] != 0 && tile[2] != "dirt-bones" && tile[2] != "dirt-skull")
            randomTile[2] = "dirt-skull"
            randomTile[3] = 8
            randomTile[4] = 8
        }

        for (let i = 0; i < this.levelSize.diamonds; i++) {
            let randomTile = this.getRandomIndex(levelArray, (tile) => tile[1] != 0 && tile[2] != "dirt-bones" && tile[2] != "dirt-skull" && tile[2] != "dirt-diamond")
            randomTile[2] = "dirt-diamond"
            randomTile[3] = 16
            randomTile[4] = 16
        }
        return levelArray
    }

    getRandomIndex(array, condition) {
        let item = array[Math.floor(array.length * Math.random())]
        let timeout = 10
        while (!condition(item)) {
            timeout--
            if (timeout <= 0) {
                throw new Error("unable to get item that meets conditions")
            }
            item = array[Math.floor(array.length * Math.random())]
        }

        return item
    }

    onResize() {
        this.camera.targetPosition.x = this.playerPosition.x * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing)
        this.camera.targetPosition.y = this.playerPosition.y * (Theme.Game.TileSize.height + Theme.Game.TileSize.spacing)
    }

    onKeyDown(event) {
        if (this.hasMoved) {
            return
        }
        let keys = []
        keys[event.code] = true
        if ((keys["KeyW"] || keys["ArrowUp"] || keys["KeyZ"])) {
            this.actions.push("up")
            this.hasMoved = true
        }

        if (keys["KeyS"] || keys["ArrowDown"]) {
            this.actions.push("down")
            this.hasMoved = true
        }
        if (keys["KeyA"] || keys["ArrowLeft"] || keys["KeyQ"]) {
            this.actions.push("left")
            this.hasMoved = true
        }
        if (keys["KeyD"] || keys["ArrowRight"]) {
            this.actions.push("right")
            this.hasMoved = true
        }

        // if(keys["Digit1"]) {
        //     this.stateMachine.transitionTo("shop")
        // }
        // if(keys["Digit2"]) {
        //     this.stateMachine.transitionTo("upgrade")
        // }
        // if(keys["Digit3"]) {
        //     this.stateMachine.transitionTo("credits")
        // }
    }

    onKeyUp(event) {
        this.hasMoved = false
    }
    onMouseDown(event) {
        if (this.hasMoved) {
            return
        }
        this.hasMoved = true
        let delta = this.camera.screenToWorld(new Point(event.clientX, event.clientY)).difference(
            new Point()
                .clone(this.playerPosition)
                .scale(Theme.Game.TileSize.width + Theme.Game.TileSize.spacing, Theme.Game.TileSize.height + Theme.Game.TileSize.spacing)
        )
        if (Math.abs(delta.x) > Math.abs(delta.y)) {
            let direction = Math.sign(delta.x)
            if (direction > 0) {
                this.actions.push("right")
            } else {
                this.actions.push("left")
            }
        } else {
            let direction = Math.sign(delta.y)
            if (direction > 0) {
                this.actions.push("down")
            } else {
                this.actions.push("up")
            }
        }
    }

    onMouseMove(event) {
    }

    onMouseUp(event) {
        this.hasMoved = false
    }

    digSound1(i, t) {
        var n = 5e3;

        if (i > n) return null;
        return ((Math.pow(i + Math.sin(i * 0.01) * 1000, 0.25) & 200) ? 1 : -1) * Math.pow(t(i, n), 1);
    }

    digSound2(i, t) {
        var n = 5e3;

        if (i > n) return null;
        return (Math.random() * 2 - 1) * t(i, n);
    }

    gatherSound(i, t) {
        var n=1.6e4;
        var c=n/7;
        if (i > n) return null;
        var q=Math.pow(t(i,n),2.1);
        return (i<c ? ((i+Math.sin(-i/900)*10)&16) : i&13) ?q:-q;
    }

    playSound(soundFunction) {

        // Sound player
        let t = (i, n) => (n - i) / n,
            A = new AudioContext(),
            m = A.createBuffer(1, 96e3, 48e3),
            b = m.getChannelData(0)
        for (let i = 96e3; i--;)b[i] = soundFunction(i, t)
        let s = A.createBufferSource()
        s.buffer = m
        s.connect(A.destination)
        s.start()
    }
}
