import kaboom from "./libs/kaboom.mjs";
import load from "./utils/loader.js";
import { uiManager } from "./utils/UIManager.js";
import { level1Mapping, level1Layout } from "./content/level1/layout.js";
import { level2Mapping, level2Layout } from "./content/level2/layout.js";
import { level3Mapping, level3Layout } from "./content/level3/layout.js";
import Level from "./utils/level.js";
import { Player } from "./entities/player.js";
import { Camera } from "./utils/camera.js";
import { level1Config } from "./content/level1/config.js";
import { level2Config } from "./content/level2/config.js";
import { level3Config } from "./content/level3/config.js";

kaboom({
  width: 1280,
  height: 720,
  letterbox: true, // to center the canvas
});

load.fonts();
load.assets();
load.sounds();

const scenes = {
  menu: () => {
    uiManager.dislayMainMenu();
  },
  controls: () => {
    uiManager.displayControlsMenu();
  },
  1: () => {
    setGravity(level1Config.gravity);
    let lvl1 = new Level();
    lvl1.drawBackground("forest-background");
    lvl1.drawMapLayout(level1Layout, level1Mapping);
    let player = new Player(
      level1Config.startPosX,
      level1Config.startPosY,
      level1Config.speed,
      level1Config.jumpForce,
      level1Config.numLives,
      1
    );
    player.allowPassthrough();
    player.allowCoinPickup();
    let camera = new Camera();
    uiManager.displayDarkBg(270, 130);
    uiManager.displayCoinsCount();
    uiManager.displayLivesCount();
    player.updateCoinCount(uiManager.coinsCountUI);
    player.updateLivesCount(uiManager.showLivesUI);
    camera.attach(player.gameObj, 0, 200);
    lvl1.drawWaves("water", "wave");
  },
  2: () => {
    setGravity(level2Config.gravity);
    let lvl2 = new Level();
    lvl2.drawBackground("castle-background");
    lvl2.drawMapLayout(level2Layout, level2Mapping);
    let player = new Player(
      level2Config.startPosX,
      level2Config.startPosY,
      level2Config.speed,
      level2Config.jumpForce,
      level2Config.numLives,
      2
    );
    player.allowPassthrough();
    player.allowCoinPickup();
    let camera = new Camera();
    uiManager.displayDarkBg(270, 130);
    uiManager.displayCoinsCount();
    uiManager.displayLivesCount();
    player.updateCoinCount(uiManager.coinsCountUI);
    player.updateLivesCount(uiManager.showLivesUI);
    camera.attach(player.gameObj, 0, 200);
    lvl2.drawWaves("lava", "wave");
  },
  3: () => {
    setGravity(level3Config.gravity);
    let lvl3 = new Level();
    lvl3.drawBackground("sky-background-0");
    lvl3.drawBackground("sky-background-1");
    lvl3.drawBackground("sky-background-2");
    lvl3.drawMapLayout(level3Layout, level3Mapping);
    let player = new Player(
      level3Config.startPosX,
      level3Config.startPosY,
      level3Config.speed,
      level3Config.jumpForce,
      level3Config.numLives,
      3
    );
    player.allowCoinPickup();
    player.allowPassthrough();
    let camera = new Camera();
    uiManager.displayDarkBg(270, 130);
    uiManager.displayCoinsCount();
    uiManager.displayLivesCount();
    player.updateCoinCount(uiManager.coinsCountUI);
    player.updateLivesCount(uiManager.showLivesUI);
    camera.attach(player.gameObj, 0, 200);
    lvl3.drawWaves("cloud", "wave");
  },
  gameover: () => {
    uiManager.displayGameOver();
  },
  end: () => {
    add([text("end")]);
  },
};

for (let key in scenes) {
  scene(key, scenes[key]);
}

go("menu");
