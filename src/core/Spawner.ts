import { Vector } from '@math/Vector';
import { Seeker } from '@entity/Seeker';
import { EntityManager } from './EntityManager';
import { Entity } from '@entity/Entity';
import { Canvas } from './Canvas';

export class Spawner {

  private maxEntities:number = 2;
  private seekerSpawnChance:number = 100;

  public static instance:Spawner;

  public static createInstance() {
    if(!Spawner.instance) {
      Spawner.instance = new Spawner();
    }
    return Spawner.instance;
  }

  constructor() {}

  update():void {
    if(EntityManager.instance.entities.length == this.maxEntities) return;

    if (Math.floor(Math.random() * this.seekerSpawnChance) == 0) {
      var target:Entity = EntityManager.instance.getEntity(0);
      var seeker:Entity = new Seeker(this.getPosition(target.position, 25));
      seeker.addTarget(EntityManager.instance.getEntity(0));
      EntityManager.instance.addEntity(seeker);
    }
  }

  getPosition(target:Vector, distance:number):Vector {
    var position:Vector = new Vector();
    do {
      position = new Vector(Math.random() * Canvas.WIDTH, Math.random() * Canvas.HEIGHT);
    }
    while(position.distSq(target) < distance);
    return position;
  }
}