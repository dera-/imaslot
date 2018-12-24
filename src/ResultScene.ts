import {config} from "./config";

export class ResultScene extends g.Scene {
	private _score: number;
	constructor(param: g.SceneParameterObject, score: number) {
		super(param);
		this._score = score;
		this.loaded.add(this.onLoaded, this);
	}

	private onLoaded() {
		// 背景画像
		const bgSprite = new g.Sprite({
			scene: this,
			src: this.assets["nataslot_bg"] as g.ImageAsset,
			width: g.game.width,
			height: g.game.height,
			srcWidth: 1920,
			srcHeight: 1280,
			x: 0,
			y: 0
		});
		this.append(bgSprite);
		const coins = new g.FrameSprite({
			scene: this,
			src: this.assets["coins"] as g.ImageAsset,
			width: config.result.score.coin.width,
			height: config.result.score.coin.height,
			srcWidth: 400,
			srcHeight: 400,
			frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 , 11, 12, 13, 14, 15, 16, 17, 18, 19],
			frameNumber: 2,
			x: config.result.score.coin.x,
			y: config.result.score.coin.y
		});
		this.append(coins);
		const scoreFont = new g.DynamicFont({
			game: this.game,
			fontFamily: g.FontFamily.Monospace,
			size: config.result.score.label.size
		});
		const scoreLabel = new g.Label({
			scene: this,
			text: "" + this._score,
			textColor: "white",
			font: scoreFont,
			fontSize: config.result.score.label.size,
			x: config.result.score.label.x,
			y: config.result.score.label.y
		});
		this.append(scoreLabel);
		let spriteSrc = "nata_muri";
		if (this._score >= config.result.chara.thresholds.perfect) {
			spriteSrc = "nata_toutoi2";
		} else if (this._score >= config.result.chara.thresholds.good) {
			spriteSrc = "nata_suki";
		} else if (this._score >= config.result.chara.thresholds.normal) {
			spriteSrc = "nata_sushi";
		} else if (this._score >= config.result.chara.thresholds.bad) {
			spriteSrc = "nata_mu1";
		}
		const nataSprite = new g.Sprite({
			scene: this,
			src: this.assets[spriteSrc] as g.ImageAsset,
			width: config.result.chara.image.width,
			height: config.result.chara.image.height,
			srcWidth: 300,
			srcHeight: 300,
			x: config.result.chara.image.x,
			y: config.result.chara.image.y
		});
		this.append(nataSprite);
	}
}
