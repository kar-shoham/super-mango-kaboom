export class Axes {
  constructor(positions, swingDurations) {
    this.swingDurations = swingDurations;
    this.axes = [];
    for (let position of positions) {
      this.axes.push(
        add([
          sprite("axes"),
          area({
            shape: new Rect(vec2(0, 40), 30, 10),
            collisionIgnore: ["spider", "fish"],
          }),
          offscreen(),
          "axes",
          pos(position),
          scale(4),
          anchor(vec2(0, -0.75)),
          rotate(), // to be able to use angle property later
          state("swing-left", ["swing-left", "swing-right"]),
        ])
      );
    }
  }
  async swing(axe, targetAngle, swingDuration) {
    if (!axe.isOffScreen()) play("swinging-axe-sound");
    await tween(
      axe.angle,
      targetAngle,
      swingDuration,
      (val) => (axe.angle = val),
      easings.easeInOutSine
    );
  }
  setMovementPattern() {
    for (let [idx, axe] of this.axes.entries()) {
      console.log(axe);
      let leftSwing = axe.onStateEnter("swing-left", async () => {
        await this.swing(axe, -90, this.swingDurations[idx]);
        axe.enterState("swing-right");
      });
      let rightSwing = axe.onStateEnter("swing-right", async () => {
        await this.swing(axe, 90, this.swingDurations[idx]);
        axe.enterState("swing-left");
      });
      onSceneLeave(() => {
        leftSwing.cancel();
        rightSwing.cancel();
      });
    }
  }
}
