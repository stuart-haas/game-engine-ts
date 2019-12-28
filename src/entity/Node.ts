import { Types, Entity } from '@entity/Entity';
import { context } from '@core/Canvas';

export class Node extends Entity {

  public gx:number;
  public gy:number;
  public neighbors:Node[] = [];
  public parent:Node;
  public gCost:number = 0;
  public hCost:number = 0;

  public constructor(x:number = 0, y:number = 0, size:number = 32, type?:Types) {
    super();
    this.gx = x;
    this.gy = y;
    this.position.x = x * size;
    this.position.y = y * size;
    this.size = size;
    this.type = type;
    this.color = type == Types.Path ? 'red' :'blue';
  }

  public render(color?:string):void {
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.size - 2, this.size - 2);
    context.fillStyle = color || this.color;
    context.fill();
    context.closePath();
  }

  public get fCost():number {
    return this.gCost + this.hCost;
  }
}