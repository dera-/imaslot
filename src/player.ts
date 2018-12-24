import {config} from "./config";
import {DynamicFontRepository} from "./repository/DynamicFontRepository";
import {Slot} from "./slot";

const betValues = [1, 5, 10, 20, 50, 100];
const defaultBetIndex = -1;

export class Player {
	private _money: number;
	private _charaSprites: {[key: string]: g.Sprite};
	private _currentCharaStatus: string;
	private _statusPane: g.Pane;
	private _coinSprite: g.FrameSprite;
	private _moneyLabel: g.Label;
	private _additionalMoneyLabel: g.Label;
	// この下辺りの変数はmutableなやつ
	private _betValue: number;
	private _betValuesIndex: number;

	constructor(charaSprites: {[key: string]: g.Sprite}) {
		this._charaSprites = charaSprites;
		this._money = config.game.player.default_money;
		this._currentCharaStatus = config.game.player.character.default_status;
		this._betValue = 0;
		this._betValuesIndex = defaultBetIndex;
	}

	canContinue(): boolean {
		return this._money > 0;
	}

	get currentCharaStatus() {
		return this._currentCharaStatus;
	}

	get charaSprite(): g.Sprite {
		return this._charaSprites[this._currentCharaStatus];
	}

	get money(): number {
		return this._money;
	}

	get betValue(): number {
		return this._betValue;
	}

	reserve(): void {
		this._betValuesIndex++;
		this._betValuesIndex = this._betValuesIndex % betValues.length;
		this._betValue = betValues[this._betValuesIndex] * Slot.getMinimumBuyIn();
		if (this._betValue > this.money) {
			this._betValue = this.money;
			this._betValuesIndex = defaultBetIndex;
		}
	}

	bet(): void {
		this.addMoney(-1 * this._betValue);
		this.reset();
	}

	reset(): void {
		this._betValue = 0;
		this._betValuesIndex = defaultBetIndex;
	}

	addMoney(money: number): void {
		this._money += money;
		if (this._money < 0) {
			this._money = 0;
		}
		this.changeMoneyLabel(this._money);
	}

	changeFaceSprite(scene: g.Scene, status: string): void {
		scene.remove(this._charaSprites[this._currentCharaStatus]);
		this._currentCharaStatus = status;
		scene.append(this._charaSprites[this._currentCharaStatus]);
	}

	getCurrentStatusPane(scene: g.Scene): g.Pane {
		this._statusPane = new g.Pane({
			scene,
			width: config.game.player.status.width,
			height: config.game.player.status.height,
			x: config.game.player.status.x,
			y: config.game.player.status.y
		});
		if (this._coinSprite === undefined) {
			this._coinSprite = new g.FrameSprite({
				scene,
				src: scene.assets["coins"] as g.ImageAsset,
				width: config.game.player.status.coin.width,
				height: config.game.player.status.coin.height,
				srcWidth: 400,
				srcHeight: 400,
				frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 , 11, 12, 13, 14, 15, 16, 17, 18, 19],
				interval: 250,
				x: config.game.player.status.coin.x,
				y: config.game.player.status.coin.y
			});
		}
		this._coinSprite.start();
		this._statusPane.append(this._coinSprite);
		if (this._moneyLabel === undefined) {
			const font = DynamicFontRepository.instance.getDynamicFont("player");
			this._moneyLabel = new g.Label({
				scene: scene,
				text: "" + this._money,
				textColor: "white",
				font: font,
				fontSize: config.game.player.status.label.size,
				x: config.game.player.status.label.x,
				y: config.game.player.status.label.y
			});
		}
		this._statusPane.append(this._moneyLabel);
		return this._statusPane;
	}

	getAdditionalMoneyLabel(scene: g.Scene): g.Label {
		if (this._additionalMoneyLabel === undefined) {
			const font = DynamicFontRepository.instance.getDynamicFont("player");
			this._additionalMoneyLabel = new g.Label({
				scene: scene,
				text: "",
				textColor: "yellow",
				font: font,
				fontSize: config.game.player.additional_money_label.size,
				x: config.game.player.additional_money_label.x,
				y: config.game.player.additional_money_label.y
			});
		}
		return this._additionalMoneyLabel;
	}

	changeMoneyLabel(money: number): void {
		this._moneyLabel.text = "" + money;
		this._moneyLabel.invalidate();
	}

	changeAdditionalMoneyLabel(additional: number): void {
		// とりあえず追加分表示する感じにする(減少分は一旦やらない)
		this._additionalMoneyLabel.text = additional !== 0 ? "+" + additional : "";
		this._additionalMoneyLabel.invalidate();
	}
}
