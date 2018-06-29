export class DynamicFontRepository {
	public static get instance(): DynamicFontRepository {
		if (DynamicFontRepository._repository === undefined) {
			this._repository = new DynamicFontRepository();
		}
		return DynamicFontRepository._repository;
	}

	private static _repository: DynamicFontRepository;
	private dynamicFontMap: {[key: string]: g.DynamicFont};

	constructor() {
		this.dynamicFontMap = {};
	}

	getDynamicFont(key: string): g.DynamicFont {
		return this.dynamicFontMap[key];
	}

	setDynamicFont(key: string, font: g.DynamicFont): void {
		this.dynamicFontMap[key] = font;
	}
}
