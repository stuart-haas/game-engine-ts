import { Entity } from '@entity/Entity';
import { Camera } from './Camera';

export class EntityManager {

  public entities:Entity[] = [];

  private static instance:EntityManager;

  public static getInstance() {
    if(!EntityManager.instance) {
      EntityManager.instance = new EntityManager();
    }
    return EntityManager.instance;
  }

  public constructor() {
    
  }

  public addEntity(entity:Entity):void {
    this.entities.push(entity);
  }

  public getEntity(index:number):Entity {
    if(!this.entities[index]) return;
    return this.entities[index];
  }

  public removeEntity(index:number):void {
    this.entities.splice(index, 1);
  }

  public update(delta:number) {
    for(var i = 0; i < this.entities.length; i ++) {
      var entity = this.entities[i];
      if(Camera.inViewPort(entity.position.x, entity.position.y)) {
        entity.update(delta);
        entity.render();
      }
    }
  }
}