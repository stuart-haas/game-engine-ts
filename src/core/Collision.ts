import { Vector } from '@math/Vector';
import { Map } from './Map';
import { Types, Tile } from './Tile';

export class Collision {

  public static check(target: Vector, map: Map): boolean {
    var left:number = target.x / map.tileSize;
    var right:number = (target.x + map.tileSize - 1) / map.tileSize;
    var top:number = target.y / map.tileSize;
    var bottom:number = (target.y + map.tileSize - 1) / map.tileSize;

    if(left < 0) left = 0;
    if(right > Map.WIDTH) right = Map.WIDTH;
    if(top < 0) top = 0;
    if(bottom > Map.HEIGHT) bottom = Map.HEIGHT;

    left = Math.floor(left);
    right = Math.floor(right);
    top = Math.floor(top);
    bottom = Math.floor(bottom);

    for(let i = left; i <= right; i ++) { 
      for(let j = top; j <= bottom; j ++) {
        var tile: Tile = map.tileAt(i, j);
        if(tile.type == Types.Collider) {
          tile.color = '#000';
          return true;
        }
      }
    }
    return false;
  }
}