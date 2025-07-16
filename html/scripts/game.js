/**
 * The game's source code
 * @param {import("../../k.env").KAPLAYCtx} k KAPLAY Context
 */
export const game = (k) => {
	k.add([k.text(k.getSpecialAsset("demo-text"), { width: k.width(), align: "center" }), k.anchor("top"), k.stay(), k.pos(k.center().x, 0), k.fixed(), k.z(Infinity)])
	k.scene("game", () => {
		const player = k.add([k.sprite("bean"), k.pos(k.center()), k.area(), k.body()])
		player.onUpdate(() => {
			let velocity = k.vec2(0)
			velocity.x = k.isButtonDown("left")?-1:k.isButtonDown("right")?1:0
			velocity.y = k.isButtonDown("up")?-1:k.isButtonDown("down")?1:0
			velocity = velocity.unit().scale(256)
			player.move(velocity)
		})
	})
	k.go("game")
}