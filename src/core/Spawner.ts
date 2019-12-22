import { Vector } from '@math/Vector';
import { Seeker } from '@entity/Seeker';
import { Coin } from '@entity/Coin';
import { EntityManager } from './EntityManager';
import { Map } from './Map';

export class Spawner {

  private entityManager: EntityManager;
  private maxEntities = 100;
  private inverseSpawnChance: number = 100;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  update(target: Vector): void {
    if(this.entityManager.entities.length == this.maxEntities) return;

    if (Math.floor(Math.random() * this.inverseSpawnChance) == 0) {
      this.entityManager.addEntity(new Coin(this.getPosition(target)));
    }

    if (this.inverseSpawnChance > 20) {
      this.inverseSpawnChance -= 0.005;
    }
  }

  getPosition(target: Vector): Vector {
    let position = null;
    do {
      position = new Vector(Math.random() * Map.WIDTH, Math.random() * Map.HEIGHT);
    }
    while(position.distSq(target) < 5 * 5);
    return position;
  }
}