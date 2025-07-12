// This Javascript File was manually coded by @Minamotion on his laptop
//
// No need to change anything here, unless:
// 1. Your game has some kind of special asset type you want to load
// 2. You want to code your own loading screen
// 3. You don't want/have to press a button to start the game when releasing

import { game } from "/scripts/game.js";

async function loadGame() {
	//#region [Setup kaplay context]
	$("#canvas").removeAttr("hidden")
	const kSettings = await fetch("/kaplay.json").then(raw=>raw.json())
	/**
	 * @type {import("../k.env").KAPLAYCtx}
	 */
	const k = kaplay({
		global: false,
		background: kSettings.background,
		width: kSettings.viewport[0], 
		height: kSettings.viewport[1],
		crisp: !kSettings.antialiasing,
		letterbox: true,
		loadingScreen: true,
		canvas: $("#canvas").get(0)
	})
	/**
	 * @type {{name:string,asset:import("../.vscode/k.env").Asset<any>}[]}
	 */
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
				kSpecialAssets.forEach((assetData)=>{
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
	//#region [Custom loading screen, removing it does nothing bad]
	k.onLoading((progress) => {
		k.drawRect({
			width: k.width(),
			height: k.height(),
			color: k.rgb(0, 0, 0),
		});

		k.drawCircle({
			pos: k.center(),
			radius: 32,
			end: k.map(progress, 0, 1, 0, 360),
		});

		k.drawText({
			text: "Loading" + ".".repeat(k.wave(1, 4, k.time() * 12)),
			font: "monospace",
			size: 24,
			anchor: "center",
			pos: k.center().add(0, 70),
		});
	});
	//#endregion
	//#region [Load assets from assets.json, then start game]
	fetch("/assets.json").then(raw=>raw.json()).then(async (assetlist)=>{
		console.info("Started loading assets from asset list: ", assetlist)
		let oopsies = 0
		for (let index = 0; index < assetlist.length; index++) {
			const data = assetlist[index]
			if (typeof data === "object" && !Array.isArray(data)) {
				let rdata = {
					error: false,
					message: "",
					errorOut(message) {
						this.error = true
						this.message = message
						oopsies++
					}
				}
				switch (data.type) {
					case "data":
						await k.loadJSON(data.name, data.src)
						break;
					case "sprite":
						await k.loadSprite(data.name, data.src, (typeof data.options === "object")?data.options:{}).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "aseprite":
						await k.loadAseprite(data.name, data.src.image, data.src.array).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "bitfont":
						await k.loadBitmapFont(data.name, data.src, data.gridSize[0], data.gridSize[1], (typeof data.options === "object")?data.options:{}).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "spriteatlas":
						await k.loadSpriteAtlas(data.src, data.sprites).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "font":
						await k.loadFont(data.name, data.src).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "audio":
						await k.loadSound(data.name, data.src).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "shader":
						await k.loadShaderURL(data.name, data.vertsrc, data.fragsrc).onError((error) => {
							rdata.errorOut(error)
						})
						break;
					case "bean":
						await k.loadBean(data.name)
						break;
					case "plug":
						k.plug(data.src);
						break;
					case "text":
						const nasset = await k.load(new Promise(async (resolve, reject) => {
							let proceed = true;
							const text = await fetch(data.src).then(raw => raw.text()).catch((error)=>{reject(error); proceed = false})
							if (proceed) resolve(text)
						}))
						kSpecialAssets.push({name:data.name,asset:nasset})
						break;
					default:
						rdata.errorOut(`${data.type} is not a known type of asset`)
						break;
				}
				if (rdata.error) {
					console.error(`Error loading ${data.type} asset "${data.name}"\n`, rdata.message ,"\nData: ", data)
				} else {
					console.info(`Successfully loaded ${data.type} asset "${data.name}"!`)
				}
			} else {
				console.error("Error loading null asset null\nInvalid object was returned\nData: ",data)
				oopsies++
			}
		}
		if (oopsies > 0) {
			console.warn(`Finished loading assets with ${oopsies} errors`)
		} else {
			console.info("Finished loading assets with no errors")
		}
	}).finally(() => game(k))
	//#endregion
}

$("#begin").on("click", function() {
	this.hidden = true
	this.disabled = true
	loadGame()
})

$(document).ready(function() {
	$("#begin").removeAttr("hidden")
})