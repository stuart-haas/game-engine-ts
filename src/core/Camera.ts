import { Vector } from '@math/Vector';
import { Math2 } from '@math/Math2';
import { Map } from './Map';
import { Canvas } from './Canvas';

export class Camera {

  public static OFFSET_X:number;
  public static OFFSET_Y:number;
  public static X:number;
  public static Y:number;

  public position: Vector = new Vector();
  public scrollSpeed: number;

  public constructor(scrollSpeed?: number) {
    this.scrollSpeed = scrollSpeed || 0.05;
  }

  public update(context: CanvasRenderingContext2D, target: Vector, callback?: Function): void {
    context.clearRect(0, 0, Canvas.WIDTH, Canvas.HEIGHT);
    context.save();

    Camera.OFFSET_X = Math.round(target.x - Camera.X);
    Camera.OFFSET_Y = Math.round(target.y - Camera.Y);

    this.position.x = this.position.x  + ((target.x - Canvas.WIDTH / 2) - this.position.x) * this.scrollSpeed;
    this.position.y = this.position.y  + ((target.y - Canvas.HEIGHT / 2) - this.position.y) * this.scrollSpeed;

    this.position.x = Math2.clamp(this.position.x, 0, Map.WIDTH -  Canvas.WIDTH);
    this.position.y = Math2.clamp(this.position.y, 0, Map.HEIGHT - Canvas.HEIGHT);

    context.translate(-this.position.x, -this.position.y);

    callback();

    Camera.X = this.position.x;
    Camera.Y = this.position.y;

    context.restore();
  }

  public static in_viewport(x: number, y: number): boolean {
    if(
      x < Camera.OFFSET_X - Canvas.WIDTH / 2 ||
      x > Camera.X + Canvas.WIDTH ||
      y < Camera.OFFSET_Y - Canvas.HEIGHT / 2 ||
      y > Camera.Y + Canvas.HEIGHT
    ) {
      return false;
    }
    return true;
  }
}