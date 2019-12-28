import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@render/SpriteSheet';
import { SpriteAnimation } from '@render/SpriteAnimation';
import { Map } from '@core/Map';
import { Collision } from '@physics/Collision';
import { AStar } from '@behavior/AStar';

export class Seeker extends Entity {

  private map:Map;
  private seekThreshold:number;
  private distance:Vector;
  private force:Vector;
  private sprite:SpriteSheet;
  private animation:SpriteAnimation;
  private astar: AStar;

  constructor(position:Vector, maxForce?:number, seekThreshold?:number) {
      super(position, maxForce);
      this.map = Map.getInstance();
      this.seekThreshold = seekThreshold || 256;
      this.sprite = new SpriteSheet(this, "/resources/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
      this.astar = new AStar();
  }

  public update():void {

    this.animation.update();

    Collision.detect(this, 0, function(source:Entity, target:Entity) {
      target.color = 'blue';
      Collision.resolve(source, target);
    });

    for(var i = 0; i < this.targets.length; i ++) {
      var target = this.targets[i];
      this.astar.search(this.position, target);
      this.distance = target.clone().subtract(this.position);
      if(this.distance.length <= this.seekThreshold && this.distance.length > this.seekThreshold / 2) {
        if(Vector.lineOfSight(this.map, this.position, target)) {
          this.distance = target.clone().subtract(this.position);
          this.force = this.distance.normalize().multiply(this.maxForce);
          this.acceleration.add(this.force);
        }
      }
    }

    super.update();
  }

  public render():void {
    this.animation.render();
  }
}
