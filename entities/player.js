export class Player {
  isRespawned = false;
  heightDelta = 0; // for knowing if ascending or descending (jumping or falling)
  coyoteTime = 0.5;
  lastJumpTime = 0;
  hasJumped = false;
  coins = 0;
  constructor(
    posX,
    posY,
    speed,
    jumpForce,
    nbLives,
    currentLevelScene,
  ) {
    this.currentLevelScene = currentLevelScene;
    this.lives = nbLives;
    this.speed = speed;
    this.initialX = posX;
    this.initialY = posY;
    this.jumpForce = jumpForce;
    this.makePlayer();
    this.setPlayerControls();
    this.update();
    this.prevHeight = this.gameObj.pos.y;
  }
  makePlayer() {
    this.gameObj = add([
      sprite("player", { anim: "idle" }),
      area({ shape: new Rect(vec2(0, 3), 8, 8) }),
      body(),
      "player",
      scale(4),
      anchor("center"),
      pos(this.initialX, this.initialY),
    ]);
  }
  allowPassthrough() {
    this.gameObj.onBeforePhysicsResolve((collision) => {
      if (collision.target.is("passthrough") && this.gameObj.isJumping()) {
        collision.preventResolution();
      }
      if (collision.target.is("passthrough") && isKeyDown("down")) {
        collision.preventResolution();
      }
    });
  }
  allowCoinPickup() {
    this.gameObj.onCollide("coin", (coin) => {
      this.coins++;
      coin.destroy();
      play("coin-sound");
    });
  }
  setPlayerControls() {
    onKeyDown("left", () => {
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run");
      this.gameObj.flipX = true;
      if (!this.isRespawned) this.gameObj.move(-this.speed, 0);
    });
    onKeyDown("right", () => {
      if (this.gameObj.curAnim() !== "run") this.gameObj.play("run");
      this.gameObj.flipX = false;
      if (!this.isRespawned) this.gameObj.move(this.speed, 0);
    });
    onKeyDown("space", () => {
      if (this.gameObj.isGrounded() && !this.isRespawned) {
        this.gameObj.jump(this.jumpForce);
        play("jump-sound");
      }
      if (
        !this.gameObj.isGrounded() &&
        time() - this.lastJumpTime < this.coyoteTime &&
        !this.hasJumped
      ) {
        this.hasJumped = true;
        play("jump-sound");
        this.gameObj.jump(this.jumpForce);
      }
    });
    onKeyRelease(() => {
      if (isKeyReleased("left") || isKeyReleased("right")) {
        this.gameObj.play("idle");
      }
    });
  }
  playerRespawn() {
    if (this.lives > 0) {
      this.lives--;
      this.gameObj.pos = vec2(this.initialX, this.initialY);
      this.isRespawned = true;
      setTimeout(() => {
        this.isRespawned = false;
      }, 500);
      return
    }
    go('gameover')
  }
  update() {
    onUpdate(() => {
      this.heightDelta = this.prevHeight - this.gameObj.pos.y;
      this.prevHeight = this.gameObj.pos.y;

      if (this.gameObj.isGrounded()) {
        this.lastJumpTime = time();
        this.hasJumped = false;
      }

      if (this.gameObj.pos.y > 1000) {
        play("hit-sound", { speed: 1.5 });
        this.playerRespawn();
      }
      if (!this.gameObj.isGrounded() && this.heightDelta != 0) {
        if (this.heightDelta < 0) {
          this.gameObj.play("jump-down");
        } else {
          this.gameObj.play("jump-up");
        }
      }
      if (
        this.gameObj.isGrounded() &&
        (this.gameObj.curAnim() == "jump-down" ||
          this.gameObj.curAnim() == "jump-up")
      ) {
        this.gameObj.play("idle");
      }
    });
  }
  updateCoinCount(coinCountUi) {
    onUpdate(() => {
      coinCountUi.text = `${this.coins} / ${coinCountUi.fullCoinCount}`;
      if(this.coins ==  coinCountUi.fullCoinCount){
        go(this.currentLevelScene !== 3 ? this.currentLevelScene+1 : 'end')
      }
    });
  }

  updateLivesCount(livesCountUi) {
    onUpdate(() => {
      livesCountUi.text = `${this.lives}`;
    });
  }
}
