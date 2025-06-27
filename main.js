// This Javascript File was manually coded by @Minamotion on his laptop
//
// No need to change anything here, unless:
// 1. Your game has some kind of special asset type you want to load
// 2. You want to code your own loading screen
// 3. You don't want/have to press a button to start the game when releasing

import { game } from "/scripts/game.js";

const beginBtn = document.getElementById("begin")
beginBtn.addEventListener("click", async () => {
	//#region [Setup kaplay context]
	beginBtn.hidden = true
	beginBtn.disabled = true
	const kSettings = await fetch("/kaplay.json").then(raw=>raw.json())
	/**
	 * @type {import("./.vscode/k.env").KAPLAYCtx}
	 */
	let k = kaplay({
		global: false,
		background: kSettings.background,
		width: kSettings.viewport[0], 
		eight: kSettings.viewport[1],
		crisp: !kSettings.antialiasing,
		letterbox: true,
		loadingScreen: true
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
						k = k.plug(data.src);
						break;
					default:
						rdata.errorOut(`${data.type} is not a known type of asset`)
						break;
				}
				if (rdata.error) {
					console.error(`Error loading ${data.type} asset "${data.name}"\n`, rdata.message ,"\nData: ", data)
				} else {
					console.info(`Successfully ${data.type} loaded asset ${data.name}`)
				}
			} else {
				console.error(`Error loading asset #"${index}": Invalid object was returned`, data)
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
})