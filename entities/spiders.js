export class Spiders {
  constructor(positions, ranges, velocities, type) {
    this.ranges = ranges;
    this.velocities = velocities;
    this.spiders = []
    for (let position of positions) {
      this.spiders.push(
        add([
          sprite(`spider-${type}`, { anim: "crawl" }),
          pos(position),
          area({
            shape: new Rect(vec2(0, 4.5), 20, 6),
            collisionIgnore: ["spider"],
          }),
          "spider",
          anchor("center"),
          body(),
          scale(4),
          state("idle", ["idle", "crawl-left", "crawl-right"]),
          offscreen(),
        ])
      );
    }
  }

  async crawl(spider, moveBy, duration){
    if(spider.curAnim() !== 'crawl') spider.play('crawl')
    await tween(
      spider.pos.x,
      spider.pos.x + moveBy,
      duration,
      (posX) => spider.pos.x = posX,
      easings.easeOutSine
    )
  }

  setMovementPattern() {
    for (let [idx, spider] of this.spiders.entries()) {
      const idle = spider.onStateEnter("idle", async (prevState) => {
        if (spider.curAnim() !== "idle") spider.play("idle");

        await new Promise((resolve) => {
          setTimeout(() => resolve(), 1000);
        });

        if (prevState === "crawl-left") {
          spider.enterState('crawl-right')
          return;
        }

        spider.jump()
        if(!spider.isOffScreen()){
          play('spider-attack-sound', {volume: 0.5})
        }

        spider.enterState('crawl-left')
      });

      let crawlLeft = spider.onStateEnter('crawl-left', async(prevState) => {
        spider.flipX = false
        await this.crawl(spider, -this.ranges[idx], this.velocities[idx])

        spider.enterState('idle', 'crawl-left')
      })

      let crawlRight = spider.onStateEnter('crawl-right', async(prevState) => {
        spider.flipX = true
        await this.crawl(spider, this.ranges[idx], this.velocities[idx])

        spider.enterState('idle')
      })

      onSceneLeave(() => {
        idle.cancel()
        crawlLeft.cancel()
        crawlRight.cancel()
      })
    }
  }
  allowPassthrough() {
    for(let spider of this.spiders){
      spider.onBeforePhysicsResolve((collision) => {
        if (collision.target.is("passthrough") && spider.isJumping()) {
          collision.preventResolution();
        }
        if (collision.target.is("passthrough") && isKeyDown("down")) {
          collision.preventResolution();
        }
      });
    }
  }
}
