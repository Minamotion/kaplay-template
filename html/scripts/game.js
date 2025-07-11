/**
 * The game's source code
 * @param {import("../.vscode/k.env").KAPLAYCtx} k KAPLAY Context
 */
export const game = (k) => {
	k.add([k.text("This is a blank canvas, replace it with whatever you want!", { width: k.width() })])
}