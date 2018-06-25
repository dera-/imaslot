import {config} from "./config";

export class Player {
	private _money: number;
	private _charaSprites: {[key: string]: g.Sprite};
	private _currentCharaStatus: string;

	constructor(charaSprites: {[key: string]: g.Sprite}) {
		this._charaSprites = charaSprites;
		this._money = config.game.player.default_money;
		this._currentCharaStatus = config.game.player.character.default_status;
	}

	canContinue(): boolean {
		return this._money > 0;
	}

	set currentCharaStatus(status: string) {
		this._currentCharaStatus = status;
	}

	get charaSprite(): g.Sprite {
		return this._charaSprites[this._currentCharaStatus];
	}

	get money(): number {
		return this._money;
	}

	addMoney(money: number): void {
		this._money += money;
	}

	changeFaceSprite(scene: g.Scene, status: string): void {
		scene.remove(this._charaSprites[this._currentCharaStatus]);
		this._currentCharaStatus = status;
		scene.append(this._charaSprites[this._currentCharaStatus]);
	}

	// getMoneyLabel(): g.Label {
	//
	// }
}
