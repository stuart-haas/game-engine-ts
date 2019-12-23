import { Vector } from '@math/Vector';
import { Map } from './Map';
import { Types, Tile } from './Tile';
import { Entity } from '@entity/Entity';

export class Collision {

  public static check(target: Entity, map: Map): boolean {
    var left:number = target.position.x / map.tileSize;
    var right:number = (target.position.x + map.tileSize) / map.tileSize;
    var top:number = target.position.y / map.tileSize;
    var bottom:number = (target.position.y + map.tileSize) / map.tileSize;

    if(left < 0) left = 0;
    if(right > Map.WIDTH) right = Map.WIDTH;
    if(top < 0) top = 0;
    if(bottom > Map.HEIGHT) bottom = Map.HEIGHT;

    for(var i = left; i <= right; i ++) { 
      for(var j = top; j <= bottom; j ++) {
        var tile: Tile = map.tileAt(Math.floor(i), Math.floor(j));
        if(tile.type == Types.Collider) {
          tile.color = '#000';
          Collision.resolve(target, tile, map);
          return true;
        }
      }
    }
    return false;
  }

  public static resolve(r1: Entity, r2: Entity, map: Map): boolean {
    var collisionSide: string;
    var colliding: boolean = false;
    
    var rv1: Vector = new Vector(r1.position.x, r1.position.y);
    var rv2: Vector = new Vector(r2.position.x, r2.position.y);
    var v0: Vector = rv2.subtract(rv1);

    if(Math.abs(v0.x) < map.tileSize / 2 + map.tileSize / 2) {
      if(Math.abs(v0.y) < map.tileSize /2 + map.tileSize / 2) {
        var overlapX:number = map.tileSize / 2 + map.tileSize / 2 - Math.abs(v0.x);
        var overlapY:number = map.tileSize / 2 + map.tileSize / 2 - Math.abs(v0.y);

        if(overlapX >= overlapY) {
          if(v0.y > 0) {
            collisionSide = "Top";
            r1.velocity.y = 0;
            r1.position.y = r1.position.y - overlapY;
            colliding = true;
          } else {
            collisionSide = "Bottom";
            r1.velocity.y = 0;
            r1.position.y = r1.position.y + overlapY;
            colliding = true;
          }
        } else {
          if(v0.x > 0) {
            collisionSide = "Left";
            r1.velocity.x = 0;
            r1.position.x = r1.position.x - overlapX;
            colliding = true;
          } else {
            collisionSide = "Right";
            r1.velocity.x = 0;
            r1.position.x = r1.position.x + overlapX;
            colliding = true;
          }
        }
      }
    }
    return colliding;
  }
}