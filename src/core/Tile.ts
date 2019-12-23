import { Entity } from '@entity/Entity';
import { Vector } from '@math/Vector';

export enum Types{
  Path = 0,
  Collider = 1
}

export class Tile extends Entity {

  public type: number;

  public constructor(x: number, y: number, type: Types) {
    super();
    this.position.x = x;
    this.position.y = y;
    this.type = type;
    this.color = type == Types.Path ? 'red' : 'blue';
  }
}