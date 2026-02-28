# My [KAPLAY.js](https://kaplayjs.com/) template
A template for [KAPLAY.js](https://kaplayjs.com/) games

It's up to you if you wanna use this template or not.

The code of the html can be found at [./html/](./html/)

## How to switch to v4000?
If you wanna use v4000, then do the following:

1. Replace [k.env.d.ts](./.vscode/k.env.d.ts) with [this file](https://unpkg.com/kaplay@next/dist/types.d.ts)
2. Make this change in [index.html](./html/index.html):
	```diff
	- <script src="https://unpkg.com/kaplay@3001.0.19/dist/kaplay.js"></script>
	+ <script src="https://unpkg.com/kaplay@next/dist/kaplay.js"></script>
	```
3. That's it! Enjoy making games in v4000!

## And now for some well-deserved credits
Thank you [@lajbel](https://github.com/lajbel) from the [KAPLAY Team](https://github.com/kaplayjs/) for the [k.env.d.ts](./.vscode/k.env.d.ts) file! _(Link to [Issue#73 on KAPLAY's Github](https://github.com/kaplayjs/kaplay/issues/773))_