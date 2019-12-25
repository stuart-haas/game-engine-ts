import { Entity } from '@entity/Entity';
import { Camera } from './Camera';
import { Vector } from '@math/Vector';
import { Map } from './Map';

export class EntityManager {

  public entities: Entity[] = [];
  
  private map: Map;

  private static instance: EntityManager;

  public static getInstance() {
    if(!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  public constructor() {
    this.map = Map.getInstance();
  }

  public addEntity(entity: Entity): void {
    this.entities.push(entity);
  }

  public update(target: Vector) {
    for(var i = 0; i < this.entities.length; i ++) {
      var entity = this.entities[i];
      if(Camera.inViewPort(entity.position.x, entity.position.y)) {
        entity.update(target);
        entity.render();
      }
    }
  }
}