import { Entity } from '@entity/Entity';
import { Camera } from './Camera';
import { Vector } from '@math/Vector';
import { Collision } from '@physics/Collision';
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

  public update(target: Vector, context: CanvasRenderingContext2D) {
    for(var i = 0; i < this.entities.length; i ++) {
      var entity = this.entities[i];
      if(Camera.inViewPort(entity.position.x, entity.position.y)) {
        entity.update(target);
        var neighbors = Vector.findInRadius(entity.position, 128, 8, new Vector(this.map.tileSize / 2, this.map.tileSize / 2));
        var tiles = this.map.renderNeighbors(neighbors, context);
        entity.tiles = tiles;
        entity.render(context);
      }
    }
  }
}