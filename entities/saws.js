export class Saws {
  constructor(positions, ranges) {
    this.positions = positions;
    this.ranges = ranges;
    this.saws = [];
    for (const position of this.positions) {
      this.saws.push(
        add([
          sprite("saw"),
          area(),
          anchor("center"),
          pos(position),
          scale(4),
          rotate(),
          state("rotate-left", ["rotate-left", "rotate-right"]),
          offscreen(),
          "saws",
        ])
      );
    }
  }
  async rotateAndMove(saw, moveBy) {
    if (!saw.isOffScreen()) play("saw-sound");
    await Promise.all([
      tween(
        saw.pos.x,
        saw.pos.x + moveBy,
        1,
        (posX) => (saw.pos.x = posX),
        easings.linear
      ),
      tween(saw.angle, 360, 2, (angle) => (saw.angle = angle), easings.linear),
    ]);
  }
  setMovementPattern() {
    for (let [idx, saw] of this.saws.entries()) {
      let rotateLeft = saw.onStateEnter("rotate-left", async () => {
        await this.rotateAndMove(saw, -this.ranges[idx]);
        saw.angle = 0;
        saw.enterState("rotate-right");
      });
      let rotateRight = saw.onStateEnter("rotate-right", async () => {
        await this.rotateAndMove(saw, this.ranges[idx]);
        saw.angle = 0;
        saw.enterState("rotate-left");
      });
      onSceneLeave(() => {
        rotateLeft.cancel();
        rotateRight.cancel();
      });
    }
  }
}
