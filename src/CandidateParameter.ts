export interface CandidateParameter {
	defaultMoney: number;
	maxSpeed: number;
}

export const candidates: CandidateParameter[] = [
	// 現状パターン
	{
		defaultMoney: 20,
		maxSpeed: 2000 / 30
	},
	// スピンスピード遅くしたパターン
	{
		defaultMoney: 20,
		maxSpeed: 1000 / 30
	},
	// スピンスピード遅くして初期の持ちチップ数も増やしたパターン
	{
		defaultMoney: 40,
		maxSpeed: 1000 / 30
	}
];
