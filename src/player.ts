import {config} from "./config";
import {DynamicFontRepository} from "./repository/DynamicFontRepository";
import {Slot} from "./slot";

const betValues = [1, 5, 10, 50, 100];
const defaultBetIndex = -1;

export class Player {
	private _money: number;
	private _charaSprites: {[key: string]: g.Sprite};
	private _currentCharaStatus: string;
	private _moneyLabel: g.Label;
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

	getMoneyLabel(scene: g.Scene): g.Label {
		const font = DynamicFontRepository.instance.getDynamicFont("player");
		if (this._moneyLabel === undefined) {
			this._moneyLabel = new g.Label({
				scene: scene,
				text: "残チップ数：" + this._money,
				textColor: "white",
				font: font,
				fontSize: config.game.player.label.size,
				x: config.game.player.label.x,
				y: config.game.player.label.y
			});
		}
		return this._moneyLabel;
	}

	changeMoneyLabel(money: number): void {
		this._moneyLabel.text = "残チップ数：" + money;
		this._moneyLabel.invalidate();
	}
}
