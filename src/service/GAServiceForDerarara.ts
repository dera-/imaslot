import {GoogleAnalyticsService, GTMEventData} from "akashic-analytics";
import {CandidateParameter, candidates} from "../CandidateParameter";

export class GAServiceForDerarara extends GoogleAnalyticsService {
	static initialize(gameTitle: string, configs: CandidateParameter[] = []): void {
		GAServiceForDerarara._instance = new GAServiceForDerarara(gameTitle, configs);
	}
	static get instance(): GAServiceForDerarara {
		return GAServiceForDerarara._instance;
	}

	private static _instance: GAServiceForDerarara;

	private constructor(gameTitle: string, configs: CandidateParameter[] = []) {
		super(gameTitle, configs);
	}

	getParameter(): CandidateParameter {
		const parameter = super.getParameter();
		if (parameter === {}) {
			return candidates[0];
		}
		return parameter as CandidateParameter;
	}

	protected createEventData(data: GTMEventData): any {
		let eventLabel = `pattern_no${this.currentNumber}`;
		if (data.value != null) {
			eventLabel += "_" + data.value;
		}
		return {
			event: "analytics",
			eventCategory: data.title,
			eventAction: data.action,
			eventLabel: eventLabel,
			eventValue: 1
		};
	}
}
