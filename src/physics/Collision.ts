import { Vector } from '@math/Vector';
import { Map } from '@core/Map';
import { Types, Entity } from '@entity/Entity';

export class Collision {

  public static detect(source: Entity, distance: number = 0, callback?: Function): boolean {
    var map = Map.getInstance();
    var neighbors: Entity[] = map.findNeighors(source.position, distance);

    for(var i = 0; i < neighbors.length; i ++) {
      var target:Entity = neighbors[i];
      if(target.type == Types.Collider) {
        callback(source, target, map);
        return true;
      }
    }
    return false;
  }

  public static resolve(source: Entity, target: Entity): boolean {
    var map = Map.getInstance();
    var colliding: boolean = false;
    
    var rv1: Vector = new Vector(source.position.x, source.position.y);
    var rv2: Vector = new Vector(target.position.x, target.position.y);
    var v0: Vector = rv2.subtract(rv1);

    if(Math.abs(v0.x) < map.tileSize / 2 + map.tileSize / 2) {
      if(Math.abs(v0.y) < map.tileSize /2 + map.tileSize / 2) {
        var overlapX:number = map.tileSize / 2 + map.tileSize / 2 - Math.abs(v0.x);
        var overlapY:number = map.tileSize / 2 + map.tileSize / 2 - Math.abs(v0.y);

        if(overlapX >= overlapY) {
          if(v0.y > 0) {
            // Top
            source.velocity.y = 0;
            source.position.y = source.position.y - overlapY;
            colliding = true;
          } else {
            // Bottom
            source.velocity.y = 0;
            source.position.y = source.position.y + overlapY;
            colliding = true;
          }
        } else {
          if(v0.x > 0) {
            // Left
            source.velocity.x = 0;
            source.position.x = source.position.x - overlapX;
            colliding = true;
          } else {
            // Right
            source.velocity.x = 0;
            source.position.x = source.position.x + overlapX;
            colliding = true;
          }
        }
      }
    }
    return colliding;
  }
}