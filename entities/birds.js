export class Birds {
  constructor(positions, ranges) {
    this.ranges = ranges;
    this.birds = [];
    for (const position of positions) {
      this.birds.push(
        add([
          sprite(`bird`, { anim: "fly" }),
          area({ shape: new Rect(vec2(0), 10, 10) }),
          anchor("center"),
          pos(position),
          scale(4),
          rotate(),
          state("fly-left", [
            "fly-left",
            "fly-right",
            "dive-attack-left",
            "dive-attack-right",
          ]),
          offscreen(),
          "birds",
        ])
      );
    }
  }
  async fly(bird, moveBy, duration) {
    await tween(
      bird.pos.x,
      bird.pos.x + moveBy,
      duration,
      (posX) => (bird.pos.x = posX),
      easings.linear
    );
  }
  async dive(bird, target, duration) {
    if (bird.isOffScreen()) play("dive-sound", { volume: 0.1 });
    await tween(
      bird.pos,
      target,
      duration,
      (pos) => (bird.pos = pos),
      easings.easeInSine
    );
  }
  setMovementPattern() {
    for (let [idx, bird] of this.birds.entries()) {
      let flyLeft = bird.onStateEnter("fly-left", async () => {
        bird.flipX = false;
        await this.fly(bird, -this.ranges[idx], 0.5);
        bird.enterState("dive-attack-left");
      });
      let flyRight = bird.onStateEnter("fly-right", async () => {
        bird.flipX = true;
        await this.fly(bird, this.ranges[idx], 0.5);
        bird.enterState("dive-attack-right");
      });
      let diveLeft = bird.onStateEnter("dive-attack-left", async () => {
        await this.dive(
          bird,
          vec2(bird.pos.x - this.ranges[idx], bird.pos.y + this.ranges[idx]),
          0.5
        );
        await this.dive(
          bird,
          vec2(bird.pos.x - this.ranges[idx], bird.pos.y - this.ranges[idx]),
          0.5
        );
        bird.enterState("fly-right");
      });
      let diveRight = bird.onStateEnter("dive-attack-right", async () => {
        await this.dive(
          bird,
          vec2(bird.pos.x + this.ranges[idx], bird.pos.y + this.ranges[idx]),
          0.5
        );
        await this.dive(
          bird,
          vec2(bird.pos.x + this.ranges[idx], bird.pos.y - this.ranges[idx]),
          0.5
        );
        bird.enterState("fly-left");
      });
      onSceneLeave(() => {
        flyLeft.cancel();
        flyRight.cancel();
        diveLeft.cancel();
        diveRight.cancel();
      });
    }
  }
}
