import { Camera } from "../../libraries/Camera.js";
import { DomButton } from "../../libraries/components/DomButton.js";
import { TextPop } from "../../libraries/components/TextPop.js";
import { Point } from "../../libraries/spatial/Point.js";
import { Tween, TweenManager, Easing } from "../../libraries/Tween.js";
import { Theme } from "../../libraries/components/Theme.js"
import { Picture } from "../../libraries/CanvasArtist.js";
import { Save } from "../../libraries/Save.js";
import ShopCard from "../../libraries/ShopCard.js";
import "../../libraries/RoundRectPolyfill.js"

export class ShopState {
    constructor(view) {
        this.scaledCanvas = view.scaledCanvas
        this.stateMachine = view.stateMachine
        this.camera = new Camera()
        this.camera.scale = new Point(1, 1)
        this.tweenManager = new TweenManager()
        this.textPops = []

        this.closeShopButton = new DomButton(50, 50, view.element, "close shop", "close-shop")

        this.scrollStart = new Point(0, 0)
        this.scrollEnd = new Point(0, 0)
        this.scrollOffset = new Point(0, 128)

        this.save = new Save()

        this.shopCards = []
        for (let i = 0; i < Math.floor(16 * Math.random()) + 5; i++) {
            this.shopCards.push(new ShopCard())
        }

        this.cardHeight = 100
    }

    init(scaledCanvas) {
        this.canvasBounds = scaledCanvas.bounds
    }

    draw(ctx, scaledCanvas) {
        let fontScale = this.canvasBounds.width / 500
        let headerFontSize = Math.min(Math.floor(48 * fontScale), 48)

        ctx.save()
        this.cardHeight = Math.max(this.canvasBounds.height / 6, 100)
        ctx.translate(0, this.scrollOffset.y + (this.scrollEnd.y - this.scrollStart.y))
        for (let i = 0; i < this.shopCards.length; i++) {
            let card = this.shopCards[i]
            ctx.save()
            ctx.translate(0, this.getListRowOffset(this.cardHeight, i))
            card.draw(ctx, { cardHeight: this.cardHeight, screenWidth: this.canvasBounds.width, fontScale })
            ctx.restore()
        }
        ctx.restore()


        ctx.fillStyle = "gray"
        ctx.beginPath()
        ctx.rect(0, 0, this.canvasBounds.width, 128)
        ctx.fill()
        ctx.fillStyle = Theme.Colors.ivory
        ctx.font = `${headerFontSize}px ${Theme.Fonts.Header}`
        ctx.textAlign = "center"
        ctx.fillText("Bone Market", this.canvasBounds.width / 2, headerFontSize + 24)

        ctx.save()
        ctx.translate(16, 100)
        let inventorySpacing = 0
        if (this.getNumberOfGatheredSkulls() > 8) {
            ctx.save()
            ctx.scale(0.4, 0.4)
            ctx.translate(Theme.Game.TileSize.width / 2, Theme.Game.TileSize.height / 2)
            Picture.Skull(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
            ctx.fillStyle = Theme.Colors.ivory
            ctx.fillText(`x${this.getNumberOfGatheredSkulls()}`, 2 * Theme.Game.TileSize.width - (Theme.Game.TileSize.width / 2), Theme.Game.TileSize.height / 2)
            ctx.restore()
            inventorySpacing += 3
        } else {
            for (let i = 0; i < this.getNumberOfGatheredSkulls(); i++) {
                ctx.save()
                ctx.scale(0.4, 0.4)
                ctx.translate((i * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing) + (Theme.Game.TileSize.width / 2)), (Theme.Game.TileSize.height / 2))
                Picture.Skull(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
                ctx.restore()
                inventorySpacing++
            }
        }

        if (this.getNumberOfGatheredBones() > 8) {
            ctx.save()
            ctx.scale(0.4, 0.4)
            ctx.translate(((inventorySpacing) * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing)), 0)
            Picture.Bone(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
            ctx.fillStyle = Theme.Colors.ivory
            ctx.fillText(`x${this.getNumberOfGatheredBones()}`, 2 * Theme.Game.TileSize.width, Theme.Game.TileSize.height)
            ctx.restore()
        } else {
            for (let i = 0; i < this.getNumberOfGatheredBones(); i++) {
                ctx.save()
                ctx.scale(0.4, 0.4)
                ctx.translate(((i + inventorySpacing) * (Theme.Game.TileSize.width + Theme.Game.TileSize.spacing)), 0)
                Picture.Bone(ctx, { width: Theme.Game.TileSize.width, height: Theme.Game.TileSize.height })
                ctx.restore()
            }
        }

        ctx.fillStyle = Theme.Colors.darkgreen
        ctx.textAlign = "right"
        ctx.font = `${Math.min(Math.floor(24 * fontScale), 48)}px ${Theme.Fonts.Header}`
        ctx.fillText(`$${this.getDollars()}`, this.canvasBounds.width - 48,0)
        ctx.restore()


        this.camera.draw(ctx, scaledCanvas, () => {
            ctx.font = `${Math.min(Math.floor(48 * fontScale), 48)}px ${Theme.Fonts.Header}`
            ctx.textAlign = "center"
            let metrics = ctx.measureText(this.completeText)
            ctx.fillStyle = Theme.Colors.umber

            ctx.beginPath()
            ctx.roundRect(this.completePosition.x - metrics.width / 2, this.completePosition.y - Math.min(Math.floor(48 * fontScale), 48), metrics.width, Math.min(Math.floor(64 * fontScale), 64), 8)
            ctx.fill()
            ctx.fillStyle = Theme.Colors.ivory

            ctx.fillText(this.completeText, this.completePosition.x, this.completePosition.y)


            this.textPops.forEach(textpop => {
                textpop.draw(ctx, scaledCanvas)
            })
        })



        this.closeShopButton.setPosition(this.canvasBounds.width * (6 / 8), this.canvasBounds.height * (7 / 8))
        this.closeShopButton.draw(ctx, scaledCanvas)
    }

    getListRowOffset(height, i) {
        return 24 + (i * height + i * 8)
    }

    getNumberOfGatheredBones() {
        return this.save.getKey("bones")
    }
    getNumberOfGatheredSkulls() {
        return this.save.getKey("skulls")
    }

    getDollars() {
        let money = this.save.getKey("money")
        if(money == null) {
            this.save.setKey("money", 0)
            money = 0
        }
        return money
    }

    update(delta) {
        this.camera.update(delta)
        this.closeShopButton.update(delta)
        this.tweenManager.update()

        for (let i = 0; i < this.shopCards.length; i++) {
            let card = this.shopCards[i]
            card.update(delta, this.canvasBounds)
        }

        if (this.shopCards.length == 0 ||
             this.shopCards.filter((card) => card.item == "bones" && card.amount <= this.getNumberOfGatheredBones()).length == 0 &&
             this.shopCards.filter((card) => card.item == "skulls" && card.amount <= this.getNumberOfGatheredSkulls()).length == 0 ) {
            if (this.isComplete) {
                return
            }
            this.isComplete = true
            this.completeText = "Sold Out!"
            this.tweenManager.add(new Tween(this.completePosition, { y: 0 }, 2000, Easing.Elastic.EaseOut, () => {
                this.stateMachine.transitionTo("upgrade")
            }))
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
        this.registeredEvents["wheel"] = this.onMouseWheel.bind(this)

        for (let index in this.registeredEvents) {
            window.addEventListener(index, this.registeredEvents[index])
        }

        this.closeShopButton.attach()
        this.closeShopButton.onClick(() => {
            this.stateMachine.transitionTo("upgrade")
        })

        this.scrollStart = new Point(0, 0)
        this.scrollEnd = new Point(0, 0)
        this.scrollOffset = new Point(0, 128)

        this.save = new Save()

        this.shopCards = []
        for (let i = 0; i < Math.floor(16 * Math.random()) + 5; i++) {
            this.shopCards.push(new ShopCard())
        }

        this.completePosition = new Point(0, -1000)
        this.completeText = "Sold Out!"
        this.isComplete = false

    }

    leave() {
        for (let index in this.registeredEvents) {
            window.removeEventListener(index, this.registeredEvents[index])
        }

        this.closeShopButton.remove()
        this.textPops = []
    }

    onResize() {
    }

    onKeyDown(event) {
    }

    onKeyUp(event) {
        switch (event.code) {
            case "Enter":
                this.stateMachine.transitionTo("upgrade")
                break
        }
    }

    onTouchStart(event) {
        this.scrollStart = new Point(event.touches[0].clientX, event.touches[0].clientY)
        this.scrollEnd = new Point(event.touches[0].clientX, event.touches[0].clientY)
        this.isScrolling = true
    }

    onTouchMove(event) {
        if (!this.isScrolling) { return }
        this.scrollEnd.x = event.touches[0].clientX
        this.scrollEnd.y = event.touches[0].clientY
    }

    onTouchEnd(event) {
        this.isScrolling = false
        this.scrollOffset.x += this.scrollEnd.x - this.scrollStart.x
        this.scrollOffset.y += this.scrollEnd.y - this.scrollStart.y

        this.scrollOffset.y = this.getScrollLimits()
        this.scrollStart.x = 0
        this.scrollStart.y = 0

        this.scrollEnd.x = 0
        this.scrollEnd.y = 0
    }

    getScrollLimits() {
        return Math.min(Math.max(this.scrollOffset.y, (-(this.cardHeight * (this.shopCards.length + 1)) + this.canvasBounds.height) - 128), 128)
    }

    onMouseDown(event) {
        this.scrollStart = new Point(event.clientX, event.clientY)
        this.scrollEnd = new Point(event.clientX, event.clientY)
        this.isScrolling = true
    }

    onMouseMove(event) {
        document.body.style.cursor = "default"
        for (let i = 0; i < this.shopCards.length; i++) {
            let card = this.shopCards[i]
            let offset = this.scrollOffset.y + this.getListRowOffset(this.cardHeight, i)
            card.mouseMove(event, offset)
        }

        if (!this.isScrolling) { return }
        this.scrollEnd.x = event.clientX
        this.scrollEnd.y = event.clientY

    }

    onMouseUp(event) {
        this.isScrolling = false
        this.scrollOffset.x += this.scrollEnd.x - this.scrollStart.x
        this.scrollOffset.y += this.scrollEnd.y - this.scrollStart.y
        this.scrollOffset.y = this.getScrollLimits()
        this.scrollStart.x = 0
        this.scrollStart.y = 0

        this.scrollEnd.x = 0
        this.scrollEnd.y = 0

        let cardsToRemove = []
        for (let i = 0; i < this.shopCards.length; i++) {
            let card = this.shopCards[i]
            card.onClick((item, rate, amount) => {
                switch (item) {
                    case "bones":
                        if (this.getNumberOfGatheredBones() < amount) {
                            let pop = new TextPop(this.tweenManager, `No Sale`, new Point(0, 0), 0)
                            this.textPops.push(pop)
                            return
                        }
                        this.save.incrementKey("bones", -amount)

                        break;
                    case "skulls":
                        if (this.getNumberOfGatheredSkulls() < amount) {
                            let pop = new TextPop(this.tweenManager, `No Sale`, new Point(0, 0), 0)
                            this.textPops.push(pop)
                            return
                        }
                        this.save.incrementKey("skulls", -amount)
                        break;
                }

                this.save.incrementKey("money", rate * amount)
                let pop = new TextPop(this.tweenManager, `$${rate * amount}`, new Point(0, 0), 0)
                this.textPops.push(pop)
                cardsToRemove.push(card)
                if(this.save.getKey("story-stage") == 0) {
                    this.save.setKey("story-stage", 1)
                }
            })
        }

        this.shopCards = this.shopCards.filter((card) => !cardsToRemove.includes(card))
    }

    onMouseWheel(event) {
        this.scrollOffset.y += event.wheelDeltaY
        this.scrollOffset.y = this.getScrollLimits()
    }
}
