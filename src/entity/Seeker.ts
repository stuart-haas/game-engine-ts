import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { SpriteSheet } from '@render/SpriteSheet';
import { SpriteAnimation } from '@render/SpriteAnimation';
import { Map } from '@core/Map';
import { Tile } from './Tile';

export class Seeker extends Entity {

  private map: Map;
  private seekThreshold: number;
  private distance: Vector;
  private force: Vector;
  private sprite: SpriteSheet;
  private animation: SpriteAnimation;

  constructor(position: Vector, maxForce?: number, seekThreshold?: number) {
      super(position, maxForce);
      this.map = Map.getInstance();
      this.seekThreshold = seekThreshold || 128;
      this.sprite = new SpriteSheet(this, "/resources/seeker.png", 32, 32);
      this.animation = new SpriteAnimation(this, this.sprite, 5, 0, 5);
  }

  public update(target: Vector): void {

    this.animation.update();

    var points:Vector[] = Vector.pointsInRadius(this.position, this.seekThreshold, 8, new Vector(this.map.tileSize / 2, this.map.tileSize / 2));
    this.neighbors = this.map.renderNeighbors(points);

    var targetTile:Tile = this.map.tileByVector(target.x, target.y);

    for(var i = 0; i < this.neighbors.length; i ++) {
      var sourceTile:Tile = this.neighbors[i];
      if(targetTile.position.x == sourceTile.position.x && 
         targetTile.position.y == sourceTile.position.y )
      {
        this.distance = target.clone().subtract(this.position);
        this.force = this.distance.normalize().multiply(this.maxForce);
        this.acceleration.add(this.force);
      }
    }

    super.update();
  }

  public render(): void {
    this.animation.render();
  }
}
