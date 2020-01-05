import { Vector } from '@math/Vector';
import { Graph } from 'map/Graph';
import { Entity } from '@entity/Entity';
import { Node } from '@entity/Node';
import { Layer } from '@map/Layer';

export class Collision {

  public static detect(source:Entity, layer:Layer, distance:number = 0, callback?:Function):boolean {
    var map = Graph.getInstance();
    var neighbors:Node[] = map.getNeighborsByPoint(source.position, distance);

    for(var i = 0; i < neighbors.length; i ++) {
      var target:Node = neighbors[i];
      if(target.index > -1 && target.layer == layer) {
        callback(source, target, map);
      }
    }
    return false;
  }

  public static resolve(source:Entity, target:Entity):boolean {
    var map = Graph.getInstance();
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