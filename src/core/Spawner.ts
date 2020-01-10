import { Vector } from '@math/Vector';
import { Seeker } from '@entity/Seeker';
import { Coin } from '@entity/Coin';
import { EntityManager } from './EntityManager';
import { Entity } from '@entity/Entity';
import { Canvas } from './Canvas';

export class Spawner {

  private entityManager:EntityManager;
  private maxEntities = 2;
  private coinSpawnChance:number = 300;
  private seekerSpawnChance:number = 100;

  private static instance:Spawner;

  public static getInstance() {
    if(!Spawner.instance) {
      Spawner.instance = new Spawner();
    }
    return Spawner.instance;
  }

  constructor() {
    this.entityManager = EntityManager.getInstance();
  }

  update(target:Vector):void {
    if(this.entityManager.entities.length == this.maxEntities) return;

    if (Math.floor(Math.random() * this.coinSpawnChance) == 0) {
      this.entityManager.addEntity(new Coin(this.getPosition(target)));
    }

    if (Math.floor(Math.random() * this.seekerSpawnChance) == 0) {
      var seeker:Entity = new Seeker(this.getPosition(target));
      seeker.addTarget(this.entityManager.getEntity(0).position);
      this.entityManager.addEntity(seeker);
    }
  }

  getPosition(target:Vector):Vector {
    var position = null;
    do {
      position = new Vector(Math.random() * Canvas.WIDTH, Math.random() * Canvas.HEIGHT);
    }
    while(position.distSq(target) < 5 * 5);
    return position;
  }
}