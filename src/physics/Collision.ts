import { Vector } from '@math/Vector';
import { Map, Layer } from '@core/Map';
import { Entity } from '@entity/Entity';
import { Node } from '@entity/Node';
import { Index } from '@core/Map';

export interface CollisionCallback {
  ( origin:Entity, target:Entity ) : void;
}

export class Collision {

  public static intersects(origin:Vector, layer:Layer, callback?:Function):boolean {
    var node:Node = Map.instance.nodeFromWorldPoint(origin, layer);

    if(node !== undefined) {
      if(node.index >= Index[layer] && node.layer == layer) {
        var center:Vector = new Vector(node.position.x + 16, node.position.y + 16);
        if(origin.dist(center) <= 16) {
          if(callback) callback(node);
          return true;
        }
      }
    }
    return false;
  }

  public static detect(origin:Entity, layer:Layer, distance:number = 0, callback?:CollisionCallback):boolean {
    var neighbors:Node[] = Map.instance.getNeighborsByPoint(origin.position, layer, distance);

    for(var i = 0; i < neighbors.length; i ++) {
      var target:Node = neighbors[i];
      if(target !== undefined) {
        if(target.index >= Index[layer] && target.layer == layer) {
          if(callback) callback(origin, target);
          return true;
        }
      }
    }
    return false;
  }

  public static resolve(origin:Entity, target:Entity):boolean {
    var colliding:boolean = false;
    
    var rv1:Vector = new Vector(origin.position.x, origin.position.y);
    var rv2:Vector = new Vector(target.position.x, target.position.y);
    var v0:Vector = rv2.subtract(rv1);

    if(Math.abs(v0.x) < Map.instance.nodeSize / 2 + Map.instance.nodeSize / 2) {
      if(Math.abs(v0.y) < Map.instance.nodeSize /2 + Map.instance.nodeSize / 2) {
        var overlapX:number = Map.instance.nodeSize / 2 + Map.instance.nodeSize / 2 - Math.abs(v0.x);
        var overlapY:number = Map.instance.nodeSize / 2 + Map.instance.nodeSize / 2 - Math.abs(v0.y);

        if(overlapX >= overlapY) {
          if(v0.y > 0) {
            origin.velocity.y = 0;
            origin.position.y = origin.position.y - overlapY;
            colliding = true;
          } else {
            origin.velocity.y = 0;
            origin.position.y = origin.position.y + overlapY;
            colliding = true;
          }
        } else {
          if(v0.x > 0) {
            origin.velocity.x = 0;
            origin.position.x = origin.position.x - overlapX;
            colliding = true;
          } else {
            origin.velocity.x = 0;
            origin.position.x = origin.position.x + overlapX;
            colliding = true;
          }
        }
      }
    }
    return colliding;
  }
}