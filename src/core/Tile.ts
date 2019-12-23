export enum Types{
  Path = 0,
  Collider = 1
}

export class Tile {

  public x: number;
  public y: number;
  public type: number;
  public color: string;

  public constructor(x: number, y: number, type: Types) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = type == Types.Path ? 'red' : 'blue';
  }
}