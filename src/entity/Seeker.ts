import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@draw/SpriteSheet';
import { SpriteAnimation } from 'draw/SpriteAnimation';
import { Map, LayerId } from '@core/Map';
import { Collision } from '@physics/Collision';
import { AStar } from '@pathfinding/AStar';

export class Seeker extends Entity {

  private map:Map;
  private seekThreshold:number;
  private sprite:SpriteSheet;
  private animation:SpriteAnimation;

  constructor(position:Vector, seekThreshold:number = 128) {
      super(position, .25, 5, 5);
      this.map = Map.getInstance();
      this.seekThreshold = seekThreshold;
      this.sprite = new SpriteSheet(this);
      this.sprite.load("/resources/sprites/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
  }

  public update():void {

    this.animation.update();

    Collision.detect(this, LayerId.Collision, 0, function(source:Entity, target:Entity) {
      Collision.resolve(source, target);
    });

    for(var i = 0; i < this.targets.length; i ++) {
      var target = this.targets[i];
      var distance:Vector = target.position.clone().subtract(this.position);
      if(distance.length <= this.seekThreshold) {
        if(Vector.lineOfSight(this.map, this.position, target.position, LayerId.Collision, true)) {
          this.acceleration = Vector.evade(this.position, target.position, target.velocity, this.maxVelocity, 64);
        }
      }
    }

    super.update();
  }

  public render():void {
    this.animation.render();
  }
}
