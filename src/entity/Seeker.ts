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

  constructor(position:Vector, maxAcceleration?:number, seekThreshold:number = 512) {
      super(position, maxAcceleration);
      this.map = Map.getInstance();
      this.seekThreshold = seekThreshold;
      this.sprite = new SpriteSheet(this);
      this.sprite.load("/resources/sprites/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
  }

  public update():void {

    this.animation.update();

    Collision.detect(this, LayerId.Collision, 0, function(source:Entity, target:Entity) {
      target.color = 'blue';
      Collision.resolve(source, target);
    });

    for(var i = 0; i < this.targets.length; i ++) {
      var target = this.targets[i];
      var distance:Vector = target.clone().subtract(this.position);
      if(distance.length <= this.seekThreshold) {
        if(Vector.lineOfSight(this.map, this.position, target, LayerId.Collision, true)) {
          AStar.search(this.position, target, LayerId.Collision);
          distance = target.clone().subtract(this.position);
          var force:Vector = distance.normalize().multiply(this.maxAcceleration);
          this.acceleration.add(force);
        }
      }
    }

    super.update();
  }

  public render():void {
    this.animation.render();
  }
}
