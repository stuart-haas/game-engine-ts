import { Vector } from '@math/Vector';
import { Map, LayerId } from '@core/Map';
import { Entity } from '@entity/Entity';
import { Node } from '@entity/Node';
import { LayerIndex } from '@core/Map';

export interface CollisionCallback {
  ( source:Entity, target:Entity ) : void;
}

export class Collision {

  public static detect(source:Entity, layer:LayerId, distance:number = 0, callback?:CollisionCallback):boolean {
    var neighbors:Node[] = Map.getInstance().getNeighborsByPoint(source.position, distance);

    for(var i = 0; i < neighbors.length; i ++) {
      var target:Node = neighbors[i];
      if(target !== undefined) {
        if(target.index >= LayerIndex[layer] && target.layer == layer) {
          if(callback) callback(source, target);
          return true;
        }
      }
    }
    return false;
  }

  public static resolve(source:Entity, target:Entity):boolean {
    var map = Map.getInstance();
    var colliding:boolean = false;
    
    var rv1:Vector = new Vector(source.position.x, source.position.y);
    var rv2:Vector = new Vector(target.position.x, target.position.y);
    var v0:Vector = rv2.subtract(rv1);

    if(Math.abs(v0.x) < map.nodeSize / 2 + map.nodeSize / 2) {
      if(Math.abs(v0.y) < map.nodeSize /2 + map.nodeSize / 2) {
        var overlapX:number = map.nodeSize / 2 + map.nodeSize / 2 - Math.abs(v0.x);
        var overlapY:number = map.nodeSize / 2 + map.nodeSize / 2 - Math.abs(v0.y);

        if(overlapX >= overlapY) {
          if(v0.y > 0) {
            source.velocity.y = 0;
            source.position.y = source.position.y - overlapY;
            colliding = true;
          } else {
            source.velocity.y = 0;
            source.position.y = source.position.y + overlapY;
            colliding = true;
          }
        } else {
          if(v0.x > 0) {
            source.velocity.x = 0;
            source.position.x = source.position.x - overlapX;
            colliding = true;
          } else {
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