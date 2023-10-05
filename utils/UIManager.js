class UIManager {
  displayDarkBg(w, h) {
    add([rect(w, h), fixed(), color(0, 0, 0)]);
  }

  displayLivesCount(player) {
    this.showLivesUI = add([
      text("", {
        font: "Round",
        size: 50,
      }),
      fixed(),
      pos(70, 10),
    ]);
    this.showLivesUI.add([sprite("star-ui"), fixed(), scale(3), pos(-60, -5)]);
  }

  displayCoinsCount(player) {
    this.coinsCountUI = add([
      text("", {
        font: "Round",
        size: 50,
      }),
      fixed(),
      pos(70, 70),
      {
        fullCoinCount: get("coin", { recursive: true }).length,
      },
    ]);
    this.coinsCountUI.add([sprite("coin-ui"), pos(-60, 0), scale(3), fixed()]);
  }

  displayBlinkingUIMessage(content, position) {
    let message = add([
      text(content, {
        font: "Round",
        size: 24,
      }),
      anchor("center"),
      pos(position),
      opacity(),
      area(),
      state("flash-up", ["flash-up", "flash-down"]),
    ]);
    message.onStateEnter("flash-up", async () => {
      await tween(
        message.opacity,
        0,
        0.5,
        (val) => (message.opacity = val),
        easings.easeOutQuad
      );
      message.enterState("flash-down");
    });
    message.onStateEnter("flash-down", async () => {
      await tween(
        message.opacity,
        1,
        0.5,
        (val) => (message.opacity = val),
        easings.easeOutQuad
      );
      message.enterState("flash-up");
    });
  }

  dislayMainMenu() {
    add([sprite("forest-background"), scale(4)]);
    add([
      sprite("logo"),
      area(),
      anchor("center"),
      pos(center().x, center().y - 170),
      scale(8),
    ]);
    this.displayBlinkingUIMessage(
      "Press [Enter] to Start Game",
      vec2(center().x, center().y + 100)
    );
    onKeyPress("enter", () => {
      play("confirm-ui", { speed: 1.5 });
      go("controls");
    });
  }

  displayControlsMenu() {
    add([sprite("forest-background"), scale(4)]);
    add([
      text("CONTROLS", {
        font: "Round",
        size: 51,
      }),
      area(),
      anchor("center"),
      pos(center().x, 150),
    ]);
    let controls = add([pos(center().x, center().y)]);
    controls.add([sprite("left"), pos(-50, 0)]);
    controls.add([sprite("right"), pos(+110, 0)]);
    controls.add([sprite("up"), pos(+30, -80)]);
    controls.add([sprite("down"), pos(+30, 0)]);
    controls.add([sprite("space"), pos(-175, 0)]);
    controls.add([text("Move", { font: "Round", size: 30 }), pos(+45, +110)]);
    controls.add([text("Jump", { font: "Round", size: 30 }), pos(-166, +110)]);
    this.displayBlinkingUIMessage(
      "Press [Enter] to Start Game",
      vec2(center().x, center().y + 300)
    );

    onKeyPress("enter", () => {
      play("confirm-ui", { speed: 1.5 });
      go("3");
    });
  }

  displayGameOver() {
    this.displayDarkBg(1280, 720);
    add([
      text("GAME OVER!", {
        font: "Round",
        size: 50,
      }),
      area(),
      anchor("center"),
      pos(center().x, center().y),
    ]);
    this.displayBlinkingUIMessage(
      "Press [Enter] to Start Game",
      vec2(center().x, center().y + 100)
    );
    onKeyPress("enter", () => {
      play("confirm-ui", { speed: 1.5 });
      go("1");
    });
  }

  displayGameEnd() {
    this.displayDarkBg(1280, 720);
    add([
      text("CONGRATS! You just won the game", {
        font: "Round",
        size: 50,
      }),
      area(),
      anchor("center"),
      pos(center().x, center().y),
    ]);
    this.displayBlinkingUIMessage(
      "Press [Enter] to Play Agin",
      vec2(center().x, center().y + 100)
    );
    onKeyPress("enter", () => {
      play("confirm-ui", { speed: 1.5 });
      go("menu");
    });
  }
}

export let uiManager = new UIManager();
