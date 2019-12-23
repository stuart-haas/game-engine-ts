import { Vector } from '@math/Vector';
import { Seeker } from '@entity/Seeker';
import { Coin } from '@entity/Coin';
import { EntityManager } from './EntityManager';
import { Map } from './Map';

export class Spawner {

  private entityManager: EntityManager;
  private maxEntities = 10;
  private coinSpawnChance: number = 100;
  private seekerSpawnChance: number = 300;

  constructor(entityManager: EntityManager) {
    this.entityManager = entityManager;
  }

  update(target: Vector): void {
    if(this.entityManager.entities.length == this.maxEntities) return;

    if (Math.floor(Math.random() * this.coinSpawnChance) == 0) {
      this.entityManager.addEntity(new Coin(this.getPosition(target)));
    }

    if (Math.floor(Math.random() * this.seekerSpawnChance) == 0) {
      this.entityManager.addEntity(new Seeker(this.getPosition(target)));
    }
  }

  getPosition(target: Vector): Vector {
    var position = null;
    do {
      position = new Vector(Math.random() * Map.WIDTH, Math.random() * Map.HEIGHT);
    }
    while(position.distSq(target) < 5 * 5);
    return position;
  }
}