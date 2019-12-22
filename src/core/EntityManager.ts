import { Entity } from '@entity/Entity';
import { Camera } from './Camera';
import { Vector } from '../math/Vector';

export class EntityManager {

  public entities: Entity[] = [];

  public constructor() {

  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  public update(target: Vector, context: CanvasRenderingContext2D) {
    for(let i = 0; i < this.entities.length; i ++) {
      let entity = this.entities[i];
      if(Camera.in_viewport(entity.position.x, entity.position.y)) {
        entity.update(target);
        entity.render(context);
      }
    }
  }
}