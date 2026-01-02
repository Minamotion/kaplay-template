/** @import { KAPLAYCtx } from "../../k.env" */

/**
 * @param {KAPLAYCtx} k KAPLAY Context
 */
export const gameScene = (k) => {
    k.scene("game", () => {
		const player = k.add([
			k.sprite("bean"),
			k.pos(k.center()),
			k.area(),
			k.body()
		])
		player.onUpdate(() => {
			let v = k.vec2()
			if (k.isButtonDown("left")) { v = v.sub(1, 0) }
			if (k.isButtonDown("right")) { v = v.add(1, 0) }
			if (k.isButtonDown("up")) { v = v.sub(0, 1) }
			if (k.isButtonDown("down")) { v = v.add(0, 1) }
			v = v.unit().scale(256)
			player.move(v)
		})
	})
}