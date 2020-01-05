import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@render/SpriteSheet';
import { SpriteAnimation } from '@render/SpriteAnimation';
import { Graph } from 'map/Graph';
import { Collision } from '@physics/Collision';
import { AStar } from '@behavior/AStar';
import { Layer } from '@map/Layer';

export class Seeker extends Entity {

  private map:Graph;
  private seekThreshold:number;
  private sprite:SpriteSheet;
  private animation:SpriteAnimation;
  private astar: AStar;

  constructor(position:Vector, maxAcceleration?:number, seekThreshold:number = 256) {
      super(position, maxAcceleration);
      this.map = Graph.getInstance();
      this.seekThreshold = seekThreshold;
      this.sprite = new SpriteSheet(this, "/resources/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
      this.astar = new AStar();
  }

  public update():void {

    this.animation.update();

    Collision.detect(this, Layer.Collision, 0, function(source:Entity, target:Entity) {
      target.color = 'blue';
      Collision.resolve(source, target);
    });

    for(var i = 0; i < this.targets.length; i ++) {
      var target = this.targets[i];
      this.astar.search(this.position, target, Layer.Collision);
      var distance:Vector = target.clone().subtract(this.position);
      if(distance.length <= this.seekThreshold && distance.length > this.seekThreshold / 2) {
        if(Vector.lineOfSight(this.map, this.position, target, Layer.Collision)) {
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
