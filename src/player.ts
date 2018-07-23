import {config} from "./config";
import {DynamicFontRepository} from "./repository/DynamicFontRepository";
import {GAServiceForDerarara} from "./service/GAServiceForDerarara";

export class Player {
	private _money: number;
	private _charaSprites: {[key: string]: g.Sprite};
	private _currentCharaStatus: string;
	private _moneyLabel: g.Label;

	constructor(charaSprites: {[key: string]: g.Sprite}) {
		this._charaSprites = charaSprites;
		this._money = GAServiceForDerarara.instance.getParameter().defaultMoney;
		this._currentCharaStatus = config.game.player.character.default_status;
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

	addMoney(money: number): void {
		this._money += money;
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
