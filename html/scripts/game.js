/**
 * The game's source code
 * @param {import("../../k.env").KAPLAYCtx} k KAPLAY Context
 */
export const game = (k) => {
	k.add([k.text(k.getSpecialAsset("demo-text"), { width: k.width(), align: "center" }), k.anchor("top"), k.stay(), k.pos(k.center().x, 0)])
}