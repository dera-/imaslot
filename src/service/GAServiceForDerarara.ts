import {GoogleAnalyticsService, GTMEventData} from "@akashic-extension/nico-analytics";

export class GAServiceForDerarara extends GoogleAnalyticsService {
	constructor(gameTitle: string) {
		super(gameTitle);
	}

	protected createEventData(data: GTMEventData): any {
		let eventLabel = `playablead-${data.title}`;
		if (data.value != null) {
			eventLabel += "-" + data.value;
		}
		return {
			event: "analytics",
			eventCategory: "derarara",
			eventAction: data.action,
			eventLabel: eventLabel,
			eventValue: 1
		};
	}
}
