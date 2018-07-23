import {ZERO_LENGTH_ERROR} from "tslint/lib/verify/lines";

export const config: any = {
	game: {
		slot: {
			reel: {
				element: {
					width: 150,
					height: 150,
					count_per_set: 5,
					set_count: 5,
					dy: -35
				},
				pane: {
					width: 150,
					height: 410,
					dx: 18,
					dy: 35,
					intervalX: 160
				},
				width: 512,
				height: 470,
				x: 0,
				y: 0,
				count: 3
			},
			button: {
				start: {
					x: 200,
					y: 535,
					width: 119,
					height: 63
				},
				stop: {
					x: 50,
					y: 450,
					intervalX: 160,
					width: 77,
					height: 70
				}
			}
		},
		player: {
			character: {
				default_status: "nata_sushi",
				width: 200,
				height: 200,
				x: 556,
				y: 400
			},
			label: {
				x: 556,
				y: 360,
				size: 30
			}
		}
	}
};
