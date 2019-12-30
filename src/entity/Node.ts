import { Types, Entity } from '@entity/Entity';
import { context } from '@core/Canvas';
import { Array } from '@util/Array';
import { IHeapItem } from '@util/Heap';

export class Node extends Entity implements IHeapItem<Node> {

  public gx:number;
  public gy:number;
  public parent:Node = null;
  public neighbors:Node[] = [];
  public gCost:number = 0;
  public hCost:number = 0;
  public heapIndex:number;

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

  public compareTo(other:Node):number {
    var compare:number = Array.compare(this.fCost, other.fCost);
    if(compare == 0) {
      compare = Array.compare(this.hCost, other.hCost);
    }
    return -compare;
  }
}