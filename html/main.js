// This Javascript File was manually coded by @Minamotion on his laptop
//
// No need to change anything here, unless:
// 1. Your game has some kind of special asset type you want to load
// 2. You want to release your game on itch.io

/** @import { Asset, KAPLAYCtx } from "../k.env" */
import { game } from "/scripts/game.js";

async function loadGame() {
	//#region [Setup kaplay context]
	$("#canvas").removeAttr("hidden")
	const kSettings = await fetch("/kaplay.json").then(raw => raw.json())
	/** @type {KAPLAYCtx} */
	const k = kaplay({
		global: false,
		background: kSettings.viewport.background,
		width: kSettings.viewport.width,
		height: kSettings.viewport.height,
		crisp: kSettings.viewport.pixelated,
		letterbox: true,
		loadingScreen: true,
		canvas: $("#canvas").get(0),
		buttons: kSettings.controls,
		font: kSettings.viewport.font,
		scale: kSettings.viewport.scale
	})
	/** @type {{name:string,asset:Asset<any>}[]} */
	let kSpecialAssets = []
	k.plug(function (k) {
		return {
			/**
			 * Returns a special asset loaded by `main.js`
			 * @param {string} name Asset name
			 * @returns {Asset<any>|null} Asset or null if it doesn't exist
			 */
			getSpecialAsset(name) {
				let kSpecialAssetRequested = null
				kSpecialAssets.forEach((assetData) => {
					if (assetData.name == name) {
						kSpecialAssetRequested = assetData.asset
						return;
					}
				})
				return kSpecialAssetRequested
			}
		}
	})
	//#endregion
	//#region [Load assets from kSettings.assets]
	console.info("Loading assets from asset list: ", kSettings.assets)
	let oopsies = 0

	kSettings.assets.map(asset => {
		function oops(message) {
			console.error("Error loading asset\n", message, "\nData: ", asset)
			oopsies++
		}
		function yay() {
			if (asset.type == "bean") {
				console.info("Successfully loaded bean!")
			} else {
				console.info(`Successfully loaded ${asset.type} asset "${asset.name}"!`)
			}
		}
		if (typeof asset === "object" && !Array.isArray(asset)) {
			switch (asset.type) {
				case "data":
					k.loadJSON(asset.name, asset.src).onError(error => oops(error)).onLoad(() => yay()).onLoad(() => yay())
					break;
				case "sprite":
					k.loadSprite(asset.name, asset.src, (typeof asset.opt === "object") ? asset.opt : {}).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "aseprite":
					k.loadAseprite(asset.name, asset.src.image, asset.src.array).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "bitfont":
					k.loadBitmapFont(asset.name, asset.src, asset.gridSize[0], asset.gridSize[1], (typeof asset.opt === "object") ? asset.opt : {}).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "spriteatlas":
					k.loadSpriteAtlas(asset.src, asset.sprites).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "font":
					k.loadFont(asset.name, asset.src).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "audio":
					k.loadSound(asset.name, asset.src).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "shader":
					k.loadShaderURL(asset.name, asset.vertsrc, asset.fragsrc).onError(error => oops(error)).onLoad(() => yay())
					break;
				case "bean":
					k.loadBean(asset.name)
					break;
				case "text":
					k.load(new Promise(async (resolve, reject) => {
						fetch(asset.src).then(raw => resolve(raw.text())).catch(error => reject(error))
					})).then(data => kSpecialAssets.push({ name: asset.name, asset: data })).onError(error => oops(error)).onLoad(() => yay())
					break;
				default:
					oops(`${asset.type} is not a known type of asset`)
					break;
			}
		} else {
			oops("Invalid object was returned")
		}
	})
	k.onLoad(() => {
		console.info(`Finished loading assets with ${oopsies>0?oopsies:"no"} errors.`)
		game(k)
	})
	//#endregion
}

$("button#begin").on("click", function () {
	this.hidden = true
	this.disabled = true
	loadGame()
})

$(document).ready(function () {
	$("button#begin").removeAttr("hidden")
})