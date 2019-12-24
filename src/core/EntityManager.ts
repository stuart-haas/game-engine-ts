import { Entity } from '@entity/Entity';
import { Camera } from './Camera';
import { Vector } from '@math/Vector';
import { Collision } from '@physics/Collision';
import { Map } from './Map';

export class EntityManager {

  public entities: Entity[] = [];
  
  private map: Map;

  public constructor(map: Map) {
    this.map = map;
  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  public update(player: Entity, target: Vector, context: CanvasRenderingContext2D) {
    for(var i = 0; i < this.entities.length; i ++) {
      var entity = this.entities[i];
      if(Camera.inViewPort(entity.position.x, entity.position.y)) {
        entity.update(target);
        entity.render(context);
      }
    }
  }
}