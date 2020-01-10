import { Entity } from '@entity/Entity';
import { context } from '@core/Canvas';
import { Vector } from '@math/Vector';

export class SpriteSheet {

  public parent:Entity;
  public width:number;
  public height:number;
  public columns:number;
  public rows:number;
  public framesPerRow:number;
  public image:HTMLImageElement;
  public spriteArray:ImageData[][] = [];

  constructor(parent?:Entity) {
      this.parent = parent;
      this.spriteArray = [];
  }

  public load(path:string, width:number, height:number, callback?:Function):void {
    this.width = width;
    this.height = height;

    this.image = new Image();
    this.image.src = path;
    this.image.onload = function() {
      this.columns = this.image.width / width;
      this.rows = this.image.height / height;
      this.framesPerRow = Math.floor(this.image.width / this.width);
      if(callback) callback(this);
    }.bind(this);
  }

  public render(id:number, position:Vector):void {
    var col = id % this.columns;
    var row = Math.floor(id / this.columns);
    context.drawImage(
      this.image,
      col * this.width, row * this.height,
      this.width, this.height,
      position.x, position.y,
      this.width, this.height);
  }
}