import { game } from "/scripts/game.js";

const beginBtn = document.getElementById("begin")
beginBtn.addEventListener("click", async () => {
	//#region [Setup kaplay context]
	beginBtn.hidden = true
	beginBtn.disabled = true
	const kSettings = await fetch("/kaplay.json").then(raw=>raw.json())
	/**
	 * @type {import("./.vscode/env.d.ts").KAPLAYCtx}
	 */
	const k = kaplay({
		global: false,
		background: kSettings.background,
		width: kSettings.viewport[0], 
		eight: kSettings.viewport[1],
		crisp: !kSettings.antialiasing,
		letterbox: true,
		loadingScreen: true
	})
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
	//#region [Load assets]
	fetch("/assets.json").then(raw=>raw.json()).then(async (assetlist)=>{
		console.info("Started loading assets from asset list: ", assetlist)
		let oopsies = 0
		for (let index = 0; index < assetlist.length; index++) {
			const data = assetlist[index]
			if (typeof data === "object") {
				switch (data.type) {
					case "json":
						await k.loadJSON(data.name, data.src)
						break;
					case "sprite":
						await k.loadSprite(data.name, data.src, (typeof data.options === "object")?data.options:{})
						break;
					case "bitfont":
						await k.loadBitmapFont(data.name, data.src, data.gridSize[0], data.gridSize[1], (typeof data.options === "object")?data.options:{})
						break;
					case "spriteatlas":
						await k.loadSpriteAtlas(data.src, data.sprites)
						break;
					case "font":
						await k.loadFont(data.name, data.src)
						break;
					case "audio":
						await k.loadSound(data.name, data.src)
						break;
					case "shader":
						await k.loadShaderURL(data.name, data.vertsrc, data.fragsrc)
						break;
					case "bean":
						await k.loadBean(data.name)
						break;
					default:
						console.error(`Error loading asset "${data.name}": ${data.type} is not yet handled by the script\n`,data)
						oopsies++
						break;
				}
			} else {
				console.error(`Error loading asset #"${index}": No valid JSON was returned`, data)
				oopsies++
			}
		}
		if (oopsies > 0) {
			console.warn(`Finished loading assets, but ${oopsies} errors emerged`)
		} else {
			console.info("Finished loading assets")
		}
	}).finally(() => game(k))
	//#endregion
})