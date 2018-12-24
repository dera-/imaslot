export interface BlockParameters {
	scene: g.Scene;
	x: number;
	y: number;
	width: number;
	height: number;
}

export const createBlock = (params: BlockParameters) => {
	return new g.FilledRect({
		scene: params.scene,
		x: params.x,
		y: params.y,
		width: params.width,
		height: params.height,
		cssColor: "black",
		opacity: 0.75
	});
};
