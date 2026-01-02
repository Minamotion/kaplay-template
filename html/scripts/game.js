/** @import { KAPLAYCtx } from "../../k.env" */
import { gameScene } from "./scenes/game"


/**
 * The game's source code
 * @param {KAPLAYCtx} k KAPLAY Context
 */
export const game = (k) => {
	k.setLayers(["background","objects","hud"],"objects")
	k.add([
		k.text(k.getSpecialAsset("demo-text"), { width: k.width(), align: "center" }),
		k.anchor("top"),
		k.stay(),
		k.pos(k.center().scale(1, 0)),
		k.fixed(),
		k.layer("hud")
	])

	gameScene()

	k.go("game")
}