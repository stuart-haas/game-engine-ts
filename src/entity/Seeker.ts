import { Entity } from './Entity';
import { Vector } from '@math/Vector';
import { Shape } from '@render/Shape';

export class Seeker extends Entity {

  private seekThreshold: number;
  private distance: Vector;
  private force: Vector;

  constructor(position: Vector, maxForce?: number, seekThreshold?: number, color?: string) {
      super(position, maxForce);
      this.seekThreshold = seekThreshold || 500;
      this.color = color || '#ffff00';
  }

  update(target: Vector): void {
      this.distance = target.clone().subtract(this.position);
      if(this.distance.getLength() > this.seekThreshold) {
          this.force = this.distance.normalize().multiply(this.maxForce);
          this.acceleration.add(this.force);
      }
      super.update();
  }

  render(context: CanvasRenderingContext2D): void {
      Shape.circle(context, this.position, this.size, this.color);
  }
}
