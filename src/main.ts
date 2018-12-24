import {Reel, Slot} from "./slot";
import {config} from "./config";
import {Player} from "./player";
import {DynamicFontRepository} from "./repository/DynamicFontRepository";
import {createBlock} from "./block";
import {ResultScene} from "./ResultScene";

export = (param: g.GameMainParameterObject): void => {
	const scene = new g.Scene({
		game: g.game,
		assetIds: [
			"nataslot_line0_0",
			"nataslot_line0_1",
			"nataslot_line0_2",
			"nataslot_line1_0",
			"nataslot_line1_1",
			"nataslot_line1_2",
			"nataslot_line2_0",
			"nataslot_line2_1",
			"nataslot_line2_2",
			"nataslot_reel",
			"nata_mu1",
			"nata_mu2",
			"nata_muri",
			"nata_suki",
			"nata_sushi",
			"nata_toutoi1",
			"nata_toutoi2",
			"nataslot_bg",
			"start_button",
			"stop_button",
			"main_bgm",
			"hit_se",
			"start_se",
			"stop_se",
			"pushed_start_button",
			"pushed_stop_button",
			"button",
			"pushed_button",
			"coins"
		]
	});
	let mode = "none";
	let gameTimeLimit = config.game.time.default_limit;
	scene.message.add((msg) => {
		if (msg.data && msg.data.type === "start" && msg.data.parameters) {
			const sessionParameters: any = msg.data.parameters;
			if (sessionParameters.mode) {
				mode = sessionParameters.mode;
			}
			if (sessionParameters.totalTimeLimit) {
				// 制限時間は `totalTimeLimit` 秒
				gameTimeLimit = sessionParameters.totalTimeLimit - 10; // ゲーム終了時間の10秒前にリザルト画面に移るようにする
			}
		}
	});

	scene.loaded.add(() => {
		// フォントの生成
		const playerFont = new g.DynamicFont({
			game: scene.game,
			fontFamily: g.FontFamily.Monospace,
			size: config.game.player.status.label.size
		});
		const timeFont = new g.DynamicFont({
			game: scene.game,
			fontFamily: g.FontFamily.Monospace,
			size: config.game.time.label.size
		});
		const betFont = new g.DynamicFont({
			game: scene.game,
			fontFamily: g.FontFamily.Monospace,
			size: config.game.slot.button.bet.label_size
		});
		DynamicFontRepository.instance.setDynamicFont("player", playerFont);
		DynamicFontRepository.instance.setDynamicFont("time", timeFont);
		DynamicFontRepository.instance.setDynamicFont("bet", betFont);

		// 背景画像
		const bgSprite = new g.Sprite({
			scene: scene,
			src: scene.assets["nataslot_bg"] as g.ImageAsset,
			width: g.game.width,
			height: g.game.height,
			srcWidth: 1920,
			srcHeight: 1280,
			x: 0,
			y: 0
		});
		scene.append(bgSprite);

		// ナターリア画像
		const nataliaFaceSpriteKeys = [
			"nata_mu1",
			"nata_mu2",
			"nata_muri",
			"nata_suki",
			"nata_sushi",
			"nata_toutoi1",
			"nata_toutoi2"
		];
		const nataliaFaceSprites: {[key: string]: g.Sprite} = {};
		nataliaFaceSpriteKeys.forEach((key: string) => {
			nataliaFaceSprites[key] = new g.Sprite({
				scene: scene,
				src: scene.assets[key] as g.ImageAsset,
				width: config.game.player.character.width,
				height: config.game.player.character.height,
				srcWidth: 300,
				srcHeight: 300,
				x: config.game.player.character.x,
				y: config.game.player.character.y
			});
		});
		const player = new Player(nataliaFaceSprites);
		scene.append(player.charaSprite);
		scene.append(player.getCurrentStatusPane(scene));
		scene.append(player.getAdditionalMoneyLabel(scene));

		// リール画像
		const reelSprite = new g.Sprite({
			scene: scene,
			src: scene.assets["nataslot_reel"] as g.ImageAsset,
			width: config.game.slot.reel.width,
			height: config.game.slot.reel.height,
			srcWidth: 512,
			srcHeight: 199,
			x: config.game.slot.reel.x,
			y: config.game.slot.reel.y
		});
		scene.append(reelSprite);

		// リール・スロットの生成
		const reels: Reel[] = [];
		for (let i = 0; i < config.game.slot.reel.count; i++) {
			const paneWidth = config.game.slot.reel.pane.width;
			const paneHeight = config.game.slot.reel.pane.height;
			const paneX = config.game.slot.reel.x + config.game.slot.reel.pane.dx + i * config.game.slot.reel.pane.intervalX;
			const paneY = config.game.slot.reel.y + config.game.slot.reel.pane.dy;
			const pane = new g.Pane({
				scene: scene,
				width: paneWidth,
				height: paneHeight,
				x: paneX,
				y: paneY
			});
			const sprites = [0, 1, 2].map(num => {
				const imageKey = "nataslot_line" + i + "_" + num;
				return new g.Sprite({
					scene: scene,
					src: scene.assets[imageKey] as g.ImageAsset,
					width: config.game.slot.reel.element.width,
					height: config.game.slot.reel.element.height * config.game.slot.reel.element.count_per_set,
					srcWidth: 800,
					srcHeight: 2560
				});
			});
			const blocks = [0, 1, 2].map(num => {
				return createBlock({
					scene,
					width: paneWidth,
					height: paneHeight / 3,
					x: 0,
					y: paneHeight * num / 3
				});
			});
			const reel = new Reel(pane, sprites, blocks, i);
			scene.append(reel.image);
			reels.push(reel);
		}
		const slot = new Slot(reels);

		let hasRefreshed = false;
		const refreshGameDisplay = () => {
			if (hasRefreshed) {
				return;
			}
			slot.blackOut();
			player.changeAdditionalMoneyLabel(0);
			player.changeFaceSprite(scene, config.game.player.character.default_status);
			hasRefreshed = true;
		};

		// スタートボタンsprite
		const startButtonSprite = new g.Sprite({
			scene: scene,
			src: scene.assets["start_button"] as g.ImageAsset,
			width: config.game.slot.button.start.width,
			height: config.game.slot.button.start.height,
			srcWidth: 169,
			srcHeight: 89,
			x: config.game.slot.button.start.x,
			y: config.game.slot.button.start.y,
			touchable: true
		});
		const startButtonBlock = createBlock({
			scene,
			x: config.game.slot.button.start.x,
			y: config.game.slot.button.start.y,
			width: config.game.slot.button.start.width,
			height: config.game.slot.button.start.height
		});
		startButtonSprite.pointDown.add(() => {
			startButtonSprite.surface = g.Util.asSurface(scene.assets["pushed_start_button"] as g.ImageAsset);
			startButtonSprite.invalidate();
		});
		startButtonSprite.pointUp.add(() => {
			startButtonSprite.surface = g.Util.asSurface(scene.assets["start_button"] as g.ImageAsset);
			startButtonSprite.invalidate();
			if (slot.canStart(player.betValue)) {
				slot.addBetValue(player.betValue);
				player.bet();
				betButtonBlock.show();
				startButtonBlock.show();
				betLabel.text = player.betValue + " bet";
				betLabel.invalidate();
				(scene.assets["start_se"] as g.AudioAsset).play();
				slot.start();
			}
		});
		scene.append(startButtonSprite);
		scene.append(startButtonBlock);
		// ストップボタンsprite
		const stopButtonSprites = [0, 1, 2].map((index: number) => {
			return new g.Sprite({
				scene: scene,
				src: scene.assets["stop_button"] as g.ImageAsset,
				width: config.game.slot.button.stop.width,
				height: config.game.slot.button.stop.height,
				srcWidth: 111,
				srcHeight: 98,
				x: config.game.slot.button.stop.x  + index * config.game.slot.button.stop.intervalX,
				y: config.game.slot.button.stop.y,
				touchable: true
			});
		});
		const stopButtonBlocks = [0, 1, 2].map((index: number) => {
			return createBlock({
				scene,
				x: config.game.slot.button.stop.x + index * config.game.slot.button.stop.intervalX,
				y: config.game.slot.button.stop.y,
				width: config.game.slot.button.stop.width,
				height: config.game.slot.button.stop.height
			});
		});
		for (let index = 0; index < stopButtonSprites.length; index++) {
			const sprite = stopButtonSprites[index];
			sprite.pointDown.add(() => {
				sprite.surface = g.Util.asSurface(scene.assets["pushed_stop_button"] as g.ImageAsset);
				sprite.invalidate();
			});
			sprite.pointUp.add(() => {
				sprite.surface = g.Util.asSurface(scene.assets["stop_button"] as g.ImageAsset);
				sprite.invalidate();
				if (slot.canStop(index)) {
					stopButtonBlocks[index].show();
					(scene.assets["stop_se"] as g.AudioAsset).play();
					slot.stop(index);
				}
			});
			scene.append(sprite);
		}
		stopButtonBlocks.forEach((block) => {
			scene.append(block);
		});
		// BETボタン画像
		const betButtonSprite = new g.Sprite({
			scene: scene,
			src: scene.assets["button"] as g.ImageAsset,
			width: config.game.slot.button.bet.width,
			height: config.game.slot.button.bet.height,
			srcWidth: 205,
			srcHeight: 111,
			x: config.game.slot.button.bet.x,
			y: config.game.slot.button.bet.y,
			touchable: true
		});
		const betLabel = new g.Label({
			scene: scene,
			text: "0 bet",
			textColor: "white",
			font: DynamicFontRepository.instance.getDynamicFont("bet"),
			fontSize: config.game.slot.button.bet.label_size,
			x: 0.1 * config.game.slot.button.bet.width,
			y: 0.2 * config.game.slot.button.bet.height
		});
		const betButtonBlock = createBlock({
			scene,
			x: config.game.slot.button.bet.x,
			y: config.game.slot.button.bet.y,
			width: config.game.slot.button.bet.width,
			height: config.game.slot.button.bet.height
		});
		betButtonBlock.hide(); // 初期状態では別途ボタンは押せるようにしておく
		betButtonSprite.append(betLabel);
		betButtonSprite.pointDown.add(() => {
			betButtonSprite.surface = g.Util.asSurface(scene.assets["pushed_button"] as g.ImageAsset);
			betButtonSprite.invalidate();
		});
		betButtonSprite.pointUp.add(() => {
			refreshGameDisplay();
			betButtonSprite.surface = g.Util.asSurface(scene.assets["button"] as g.ImageAsset);
			betButtonSprite.invalidate();
			if (!slot.canBet()) {
				return;
			}
			player.reserve();
			if (player.betValue > 0) {
				startButtonBlock.hide();
			}
			betLabel.text = player.betValue + " bet";
			betLabel.invalidate();
		});
		scene.append(betButtonSprite);
		scene.append(betButtonBlock);

		const timeLabel = new g.Label({
			scene: scene,
			text: `time: ${gameTimeLimit}`,
			textColor: "white",
			font: DynamicFontRepository.instance.getDynamicFont("time"),
			fontSize: config.game.time.label.size,
			x: config.game.time.label.x,
			y: config.game.time.label.y
		});
		timeLabel.hide();
		scene.append(timeLabel);

		(scene.assets["main_bgm"] as g.AudioAsset).play();
		scene.update.add(() => {
			if (mode === "ranking" && gameTimeLimit > 0) {
				timeLabel.show();
				gameTimeLimit -= 1 / g.game.fps;
				if (gameTimeLimit <= 0) {
					(scene.assets["main_bgm"] as g.AudioAsset).stop();
					g.game.pushScene(new ResultScene({
						game: g.game,
						assetIds: [
							"nata_muri",
							"nata_mu1",
							"nata_sushi",
							"nata_suki",
							"nata_toutoi2",
							"coins",
							"nataslot_bg"
						]
					}, player.money));
				} else if (gameTimeLimit <= config.game.time.danger) {
					timeLabel.textColor = "red";
				}
				timeLabel.text = `time: ${Math.ceil(gameTimeLimit)}`;
				timeLabel.invalidate();
			}
			slot.spin();
			// リールの速度がMAXになったらブロックの開放(描画部分)
			// あまりここでやるべきでない気がするが。。。
			[0, 1, 2].forEach(i => {
				if (slot.canStop(i)) {
					stopButtonBlocks[i].hide();
				}
			});
			if (slot.isComplete()) {
				betButtonBlock.hide();
				const prise = slot.calculateScore();
				player.addMoney(prise);
				player.changeAdditionalMoneyLabel(prise);
				slot.refresh();
				if (prise > 0) {
					player.changeFaceSprite(scene, "nata_suki");
					(scene.assets["hit_se"] as g.AudioAsset).play();
				}
				hasRefreshed = false;
				scene.setTimeout(refreshGameDisplay, 2500);
			}
			// 表情変化 TODO: なんかRepositoryクラスとかで管理したい
			if (player.currentCharaStatus !== "nata_muri" && !player.canContinue()) {
				player.changeFaceSprite(scene, "nata_muri");
			}
		});
	});
	g.game.pushScene(scene);
};
