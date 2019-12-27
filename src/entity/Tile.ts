import { Types, Entity } from '@entity/Entity';
import { context } from '@core/Canvas';

export class Tile extends Entity {

  public constructor(x: number, y: number, size: number, type?: Types) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.size = size;
    this.type = type;
    this.color = type == Types.Path ? 'red' : 'blue';
  }

  public render(color?: string): void {
    if(this.type == Types.Collider) {
      context.beginPath();
      context.rect(this.position.x, this.position.y, this.size - 2, this.size - 2);
      context.fillStyle = color || this.color;
      context.fill();
      context.closePath();
    }
  }
}