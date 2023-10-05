class Level {
  drawWaves(type, anim){
    let offset = -100
    for(let i=0; i<22; i++){
      add([
        sprite(type, {anim}),
        pos(offset, 600),
        fixed(),
        scale(4)
      ])
      offset += 64
    }
  }
  drawMapLayout(layout, mappings) {
    let level_config = {
      tileWidth: 16,
      tileHeight: 12,
      tiles: mappings,
    };
    this.map = [];
    for (let layer of layout) {
      this.map.push(addLevel(layer, level_config));
    }
    for (let layer of this.map) {
      layer.use(scale(4));
    }
  }
  drawBackground(background) {
    add([sprite(background), fixed(), scale(4)]);
  }
}

export default Level
