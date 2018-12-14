export const createBlock = (x: number, y: number, width: number, height: number) => {
	return new g.FilledRect({
		x,
		y,
		width,
		height,
		cssColor: "black",
		alpha: 0.75
	});
};
