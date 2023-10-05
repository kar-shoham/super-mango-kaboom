export class Projectiles {
  constructor(positions, ranges, type) {
    this.type = type
    this.ranges = ranges;
    this.aminMap = {
      fish: "swim",
      flame: "burn",
    };
    this.fishes = [];
    for (let position of positions) {
      this.fishes.push(
        add([
          sprite(type, { anim: this.aminMap[type] }),
          type === "fish" ? rotate(90) : rotate(0),
          area({ shape: new Rect(vec2(0), 12, 12) }),
          anchor("center"),
          offscreen(),
          scale(4),
          pos(position),
          state("launch", ["launch", "rotate", "fall"]),
          "fish",
        ])
      );
    }
  }
  setMovementPattern() {
    for (let [idx, fish] of this.fishes.entries()) {
      let launch = fish.onStateEnter("launch", async () => {
        if(this.type === 'fish') fish.flipX = false
        else fish.flipY = false;
        await tween(
          fish.pos.y,
          fish.pos.y - this.ranges[idx],
          2,
          (posY) => (fish.pos.y = posY),
          easings.easeOutSine
        );
        fish.enterState("fall");
      });
      let fall = fish.onStateEnter("fall", async () => {
        if(this.type === 'fish') fish.flipX = true
        else fish.flipY = true
        await tween(
          fish.pos.y,
          fish.pos.y + this.ranges[idx],
          2,
          (posY) => (fish.pos.y = posY),
          easings.easeOutSine
        );
        fish.enterState("launch");
      });
      onSceneLeave(() => {
        launch.cancel()
        fall.cancel()
      })
    }
  }
}
