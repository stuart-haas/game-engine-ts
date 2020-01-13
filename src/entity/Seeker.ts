import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@draw/SpriteSheet';
import { SpriteAnimation } from 'draw/SpriteAnimation';
import { Map, Layer } from '@core/Map';
import { Collision } from '@physics/Collision';
import { AStar } from '@pathfinding/AStar';

export class Seeker extends Entity {

  private seekThreshold:number;
  private sprite:SpriteSheet;
  private animation:SpriteAnimation;
  private lastPosition:Vector = new Vector();

  constructor(position:Vector, seekThreshold:number = 128) {
      super(position, .25, 5, 5);
      this.seekThreshold = seekThreshold;
      this.sprite = new SpriteSheet(this);
      this.sprite.load("/resources/sprites/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
  }

  public update(delta:number):void {

    this.lastPosition = this.position.clone();

    this.animation.update();

    if(!this.lastPosition.equals(this.position)) {
      Collision.detect(this, Layer.Collision, 0, function(origin:Entity, target:Entity) {
        Collision.resolve(origin, target);
      });
    }

    for(let i = 0; i < this.targets.length; i ++) {
      var target = this.targets[i];
      var distance:Vector = target.position.clone().subtract(this.position);
      if(distance.length <= this.seekThreshold) {
        if(Vector.lineOfSight(this.position, target.position, Layer.Collision, true)) {
          this.acceleration = Vector.evade(this.position, target.position, target.velocity, this.maxVelocity, 64);
        }
      }
    }

    super.update(delta);
  }

  public render():void {
    this.animation.render();
  }
}
