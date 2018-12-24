export const config: any = {
	game: {
		slot: {
			reel: {
				element: {
					width: 150,
					height: 150,
					count_per_set: 4,
					set_count: 3,
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
					x: 50,
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
				},
				bet: {
					x: 200,
					y: 535,
					width: 119,
					height: 63,
					label_size: 28
				}
			}
		},
		player: {
			default_money: 100,
			character: {
				default_status: "nata_sushi",
				width: 200,
				height: 200,
				x: 556,
				y: 400
			},
			status: {
				x: 560,
				y: 320,
				width: 216,
				height: 72,
				coin: {
					x: 0,
					y: 0,
					width: 72,
					height: 72
				},
				label: {
					x: 96,
					y: 12,
					size: 48
				}
			},
			additional_money_label: {
				x: 600,
				y: 260,
				size: 48
			}
		},
		time: {
			label: {
				x: 580,
				y: 10,
				size: 42
			},
			default_limit: 60,
			danger: 10
		}
	},
	result: {
		score: {
			coin: {
				x: 195,
				y: 155,
				width: 150,
				height: 150
			},
			label: {
				x: 360,
				y: 200,
				size: 72
			}
		},
		chara: {
			image: {
				x: 250,
				y: 340,
				width: 300,
				height: 300
			},
			thresholds: {
				bad: 1,
				normal: 101,
				good: 301,
				perfect: 1001
			}
		}
	}
};
