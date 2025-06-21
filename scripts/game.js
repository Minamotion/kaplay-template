/**
 * The game's source code
 * @param {import("../.vscode/env.d.ts").KAPLAYCtx} k KAPLAY Context
 */
const game = (k) => {
	k.add([k.text("This is a blank canvas", { size: 14, width: k.width() })])
}

export { game }