export let level1Config = {
  gravity: 1400,
  speed: 400,
  jumpForce: 650,
  numLives: 3,
  startPosX: 1500,
  startPosY: 100,
  spiderPositions: [
    () => vec2(2000, 300),
    () => vec2(2020, 0),
    () => vec2(3200, 200),
    () => vec2(3500, 300),
  ],
  spiderAmplitudes: [300, 150, 150, 300],
  spiderSpeeds: [2, 1, 1, 2],
  spiderType: 1,
  fishPositions: [
    () => vec2(2595, 600),
    () => vec2(2655, 600),
    () => vec2(4100, 600),
    () => vec2(4220, 800),
    () => vec2(5200, 800),
    () => vec2(5300, 800),
  ],
  fishAmplitudes: [300, 500, 400, 500, 900, 800],
  fishType: 'fish',
};
