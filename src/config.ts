import {ZERO_LENGTH_ERROR} from "tslint/lib/verify/lines";

export const config: any = {
	game: {
		slot: {
			reel: {
				element: {
					width: 165,
					height: 165,
					count_per_set: 5,
					set_count: 5,
					dy: -15
				},
				pane: {
					width: 150,
					height: 170,
					dx: 18,
					dy: 20,
					intervalX: 165
				},
				width: 512,
				height: 199,
				x: 0,
				y: 20,
				count: 3
			},
			button: {
				start: {
					x: 0,
					y: 400,
					width: 169,
					height: 89
				},
				stop: {
					x: 50,
					y: 230,
					intervalX: 160,
					width: 111,
					height: 98
				}
			}
		},
		player: {
			default_money: 3,
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
