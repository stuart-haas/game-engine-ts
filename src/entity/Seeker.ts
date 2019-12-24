import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@render/SpriteSheet';
import { SpriteAnimation } from '@render/SpriteAnimation';
import { Map } from '@core/Map';

export class Seeker extends Entity {

  private map: Map;
  private seekThreshold: number;
  private distance: Vector;
  private force: Vector;
  private sprite: SpriteSheet
  private animation: SpriteAnimation

  constructor(position: Vector, maxForce?: number, seekThreshold?: number) {
      super(position, maxForce);
      this.map = Map.getInstance();
      this.seekThreshold = seekThreshold || 200;
      this.sprite = new SpriteSheet(this, "/resources/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
  }

  public update(target: Vector): void {
    this.animation.update();

    /*this.distance = target.clone().subtract(this.position);
    if(this.distance.getLength() > this.seekThreshold) {
        this.force = this.distance.normalize().multiply(this.maxForce);
        this.acceleration.add(this.force);
    }*/

    var tile = this.map.tileByVector(this.position.x, this.position.y);

    for(var i = 0; i < this.tiles.length; i ++) {
      var tile:Entity = this.tiles[i];

    }

    super.update();
  }

  public render(context: CanvasRenderingContext2D): void {
    this.animation.render(context);
  }
}
