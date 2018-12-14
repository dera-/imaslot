import {Reel, Slot} from "./slot";
import {config} from "./config";
import {Player} from "./player";
import {DynamicFontRepository} from "./repository/DynamicFontRepository";
import {createBlock} from "./block";

export = (param: g.GameMainParameterObject): void => {
	const scene = new g.Scene({
		game: g.game,
		assetIds: [
			"nataslot_line0_0",
			"nataslot_line0_1",
			"nataslot_line0_2",
			"nataslot_line0_3",
			"nataslot_line0_4",
			"nataslot_line1_0",
			"nataslot_line1_1",
			"nataslot_line1_2",
			"nataslot_line1_3",
			"nataslot_line1_4",
			"nataslot_line2_0",
			"nataslot_line2_1",
			"nataslot_line2_2",
			"nataslot_line2_3",
			"nataslot_line2_4",
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
			"pushed_button"
		]
	});
	let totalTimeLimit = config.game.default_time_limit;
	scene.message.add((msg) => {
		if (msg.data && msg.data.type === "start") {
			// type: "start" でも parameters などが与えられないこともあるので存在を確認
			if (msg.data.parameters && msg.data.parameters.totalTimeLimit) {
				// 制限時間は `totalTimeLimit` 秒
				totalTimeLimit = msg.data.parameters.totalTimeLimit;
			}
		}
	});

	scene.loaded.add(() => {
		// フォントの生成
		const playerFont = new g.DynamicFont({
			game: scene.game,
			fontFamily: g.FontFamily.Monospace,
			size: config.game.player.label.size
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
		scene.append(player.getMoneyLabel(scene));

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
			const pane = new g.Pane({
				scene: scene,
				width: config.game.slot.reel.pane.width,
				height: config.game.slot.reel.pane.height,
				x: config.game.slot.reel.x + config.game.slot.reel.pane.dx + i * config.game.slot.reel.pane.intervalX,
				y: config.game.slot.reel.y + config.game.slot.reel.pane.dy
			});
			const sprites = [0, 1, 2, 3, 4].map(num => {
				const imageKey = "nataslot_line" + i + "_" + num;
				return new g.Sprite({
					scene: scene,
					src: scene.assets[imageKey] as g.ImageAsset,
					width: config.game.slot.reel.element.width,
					height: config.game.slot.reel.element.height * config.game.slot.reel.element.count_per_set,
					srcWidth: 200,
					srcHeight: 800
				});
			});
			const reel = new Reel(pane, sprites, i);
			scene.append(reel.image);
			reels.push(reel);
		}
		const slot = new Slot(reels);

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
		const startButtonBlock = createBlock(
			config.game.slot.button.start.x,
			config.game.slot.button.start.y,
			config.game.slot.button.start.width,
			config.game.slot.button.start.height
		);
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
				stopButtonBlocks.forEach(block => block.hide());
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
			return createBlock(
				config.game.slot.button.stop.x + index * config.game.slot.button.stop.intervalX,
				config.game.slot.button.stop.y,
				config.game.slot.button.stop.width,
				config.game.slot.button.stop.height
			);
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
			fontSize: config.game.slot.button.bet.label_size
		});
		const betButtonBlock = createBlock(
			config.game.slot.button.bet.x,
			config.game.slot.button.bet.y,
			config.game.slot.button.bet.width,
			config.game.slot.button.bet.height
		);
		betButtonBlock.hide(); // 初期状態では別途ボタンは押せるようにしておく
		betButtonSprite.append(betLabel);
		betButtonSprite.pointDown.add(() => {
			betButtonSprite.surface = g.Util.asSurface(scene.assets["pushed_button"] as g.ImageAsset);
			betButtonSprite.invalidate();
		});
		betButtonSprite.pointUp.add(() => {
			betButtonSprite.surface = g.Util.asSurface(scene.assets["button"] as g.ImageAsset);
			betButtonSprite.invalidate();
			if (!slot.canBet()) {
				return;
			}
			player.reserve();
			startButtonBlock.hide();
			betLabel.text = player.betValue + " bet";
			betLabel.invalidate();
		});
		scene.append(betButtonSprite);
		scene.append(betButtonBlock);

		scene.update.add(() => {
			slot.spin();
			if (slot.isComplete()) {
				betButtonBlock.hide();
				// TODO お金が増えたエフェクトと演出
				player.addMoney(slot.calculateScore());
				slot.refresh();
			}
			// 表情変化 TODO: なんかRepositoryクラスとかで管理したい
			if (player.currentCharaStatus !== "nata_muri" && !player.canContinue()) {
				player.changeFaceSprite(scene, "nata_muri");
			}
		});

		// (scene.assets["main_bgm"] as g.AudioAsset).play();

		// const url = "https://api.search.nicovideo.jp/api/v2/illust/contents/search?q=%E3%83%8A%E3%82%BF%E3%83%BC%E3%83%AA%E3%82%A2"
		// 	+ "&targets=tags&fields=title,description,tags,viewCounter,mylistCounter,commentCounter,thumbnailUrl"
		// 	+ "&_sort=-viewCounter&_context=imaslot";
		// const a = xhr({
		// 	"url": url,
		// 	"responseType": "json",
		// }).then((resoponse) => {
		// 	console.log(resoponse);
		// }).catch((e) => {
		// 	console.error(e);
		// });
	});
	g.game.pushScene(scene);
};
