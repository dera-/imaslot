import {config} from "./config";
declare const console: any; // デバッグ用

const prise = 20;
const minimumBuyIn = 1;
const displayedIndex = 24;
const maxSpeed = 2000 / 30; // スロットのスピンの最大速度(フレーム単位)
const acceleration = maxSpeed / 45; // スロットのスピンの加速度
const minusAcceleration = maxSpeed / 30; // ストップボタン押された後のスロットのスピンの加速度
const lineElements = [
	// 上の3行はテスト用
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
	[24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2, 0, 23, 21, 19, 17, 15, 13, 11, 9, 7, 5, 3, 1],
	[4, 7, 10, 13, 16, 19, 22, 0, 3, 6, 9, 12, 15, 18, 21, 24, 2, 5, 8, 11, 14, 17, 20, 23, 1]
];

interface HitEvaluation {
	place: number[];
	ozz: number;
}

export class Slot {
	public static getMinimumBuyIn(): number {
		return minimumBuyIn;
	}

	private _reels: Reel[] = [];
	private betValue: number;
	private magnification: number; // 配当倍率。ベット額に比例して上がる

	constructor(reels: Reel[]) {
		this._reels = reels;
		this.betValue = 0;
		this.magnification = 0;
	}

	addBetValue(value: number) {
		this.betValue += value;
	}

	canBet() {
		return this.magnification === 0;
	}

	canStart() {
		// 「倍率が0でないこと=スロット動かしている」と判断しているけど、個別にフラグを用意した方がいいかなぁ？？
		return this.betValue >= minimumBuyIn && this.magnification === 0;
	}

	start() {
		this.magnification = this.betValue;
		this.betValue = 0;
		this._reels.forEach((reel: Reel) => {
			reel.allowSpin = true;
		});
	}

	spin() {
		this._reels.forEach((reel: Reel) => {
			reel.spin();
		});
	}

	canStop(index: number) {
		return this._reels[index].isMaxSpeed();
	}

	stop(index: number) {
		this._reels[index].allowSpin = false;
	}

	// ゲームが終わったかどうか
	isComplete() {
		if (this.magnification === 0) {
			return false;
		}
		return this._reels.every((reel: Reel) => {
			return reel.isStop();
		});
	}

	calculateScore(): number {
		// console.log("calculate");
		// for (const reel of this._reels) {
		// 	console.log(reel.getCurrentNumber());
		// }
		let dividends = 0;
		const displayed: number[][] = this._reels.map((reel: Reel) => reel.getCurrentNumbers());
		console.log("displayed", displayed);
		const evaluations: HitEvaluation[] = [
			{
				place: [0, 0, 0],
				ozz: 1.0
			},
			{
				place: [1, 1, 1],
				ozz: 1.5
			},
			{
				place: [2, 2, 2],
				ozz: 1.0
			},
			{
				place: [0, 1, 2],
				ozz: 1.0
			},
			{
				place: [2, 1, 0],
				ozz: 1.0
			}
		];
		evaluations.forEach((ev: HitEvaluation) => {
			console.log(displayed[0][ev.place[0]], displayed[1][ev.place[1]], displayed[2][ev.place[2]]);
			if (displayed[0][ev.place[0]] === displayed[1][ev.place[1]]
				&& displayed[0][ev.place[0]] === displayed[2][ev.place[2]]) {
				console.log("hit");
				dividends += ev.ozz * prise * this.magnification;
				console.log(dividends);
			}
		});
		return dividends;
	}

	refresh(): void {
		this.betValue = 0;
		this.magnification = 0;
	}
}

export class Reel {
	private _pane: g.Pane;
	private _sprites: g.Sprite[];
	private _elements: number[];
	private _allowSpin: boolean;
	private _spinSpeed: number;
	private _currentIndex: number;

	constructor(pane: g.Pane, sprites: g.Sprite[], index: number) {
		this._pane = pane;
		this._sprites = sprites;
		this._elements = lineElements[index];
		this._allowSpin = false;
		this._spinSpeed = 0;
		this._currentIndex = displayedIndex;
		this.initialize();
	}

	get image(): g.Pane {
		return this._pane;
	}

	set allowSpin(allowSpin: boolean) {
		this._allowSpin = allowSpin;
	}

	getCurrentNumber(): number {
		return this._elements[this._currentIndex];
	}

	getCurrentNumbers(): number[] {
		const upperIndex = this._currentIndex === 0 ? this._elements.length - 1 : this._currentIndex - 1;
		const downerIndex = (this._currentIndex + 1) % this._elements.length;
		return [this._elements[upperIndex], this._elements[this._currentIndex], this._elements[downerIndex]];
	}

	spin(): void {
		this.updateSpeed();
		this._sprites.forEach((sprite: g.Sprite) => {
			sprite.y += this._spinSpeed;
			if (sprite.y >= config.game.slot.reel.pane.height) {
				sprite.y -= config.game.slot.reel.element.height * config.game.slot.reel.element.count_per_set * this._sprites.length;
			}
			sprite.modified();
		});
		// 位置の調整
		// TODO できれば調整もアニメーション付けたいけど手抜きでいきなりずらす
		if (this._spinSpeed === 0) {
			this.setCurrentIndex(); // 今は止まった時だけindex値判定しているが、毎回必要かどうか？
			this.setYPlace();
		}
	}

	isStop(): boolean {
		return this._allowSpin === false && this._spinSpeed === 0;
	}

	isMaxSpeed(): boolean {
		return this._spinSpeed === maxSpeed;
	}

	private initialize(): void {
		this.setYPlace();
		this._sprites.forEach((sprite) => {
			this._pane.append(sprite);
		});
	}

	private setYPlace(): void {
		for (let i = 0; i < this._sprites.length; i++) {
			const sprite = this._sprites[i];
			const index = i === 0 && this._currentIndex === 24 ? this._sprites.length : i;
			sprite.y = config.game.slot.reel.element.dy
				+ config.game.slot.reel.element.height * config.game.slot.reel.element.count_per_set * index
				- config.game.slot.reel.element.height * (this._currentIndex - 1);
			if (sprite.y >= config.game.slot.reel.pane.height) {
				sprite.y -= config.game.slot.reel.element.height * config.game.slot.reel.element.count_per_set * this._sprites.length;
			}
		}
	}

	private updateSpeed(): void {
		if (this._allowSpin) {
			if (this._spinSpeed >= maxSpeed) {
				this._spinSpeed = maxSpeed;
			} else {
				this._spinSpeed += acceleration;
			}
		} else {
			if (this._spinSpeed <= 0) {
				this._spinSpeed = 0;
			} else {
				this._spinSpeed -= minusAcceleration;
			}
		}
	}

	private setCurrentIndex(): void {
		for (let i = 0; i < this._sprites.length; i++) {
			const sprite = this._sprites[i];
			const elementCount = config.game.slot.reel.element.count_per_set;
			const min = (1.5 - elementCount) * config.game.slot.reel.element.height + config.game.slot.reel.element.dy;
			const max = 2 * config.game.slot.reel.element.height + config.game.slot.reel.element.dy;
			if (min <= sprite.y && sprite.y < max) {
				this._currentIndex = i * elementCount + elementCount - Math.ceil((sprite.y - min) / config.game.slot.reel.element.width);
				if (this._currentIndex < 0) {
					this._currentIndex = this._elements.length + this._currentIndex;
				}
				this._currentIndex = this._currentIndex % this._elements.length;
				break;
			}
		}
	}
}
