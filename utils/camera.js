export class Camera{
  attachedObj = null
  attach(gameObj, offsetX = 0, fixedY){
    this.attachedObj = gameObj
    onUpdate(() => {
      camPos(this.attachedObj.pos.x + offsetX, fixedY)
    })
  }
}