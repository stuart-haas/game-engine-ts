import { Vector } from '@math/Vector';
import { Math2 } from '@math/Math2';
import { Map } from './Map';
import { Canvas, context } from './Canvas';

export class Camera {

  public static OFFSET_X:number;
  public static OFFSET_Y:number;
  public static X:number;
  public static Y:number;

  public position: Vector = new Vector();
  public scrollSpeed: number;

  private map: Map;

  private static instance: Camera;

  public static getInstance(scrollSpeed?: number) {
    if(!Camera.instance) {
      Camera.instance = new Camera(scrollSpeed);
    }
    return Camera.instance;
  }

  public constructor(scrollSpeed?: number) {
    this.map = Map.getInstance();
    this.scrollSpeed = scrollSpeed || 0.05;
  }

  public update(target: Vector): void {
    
    Camera.OFFSET_X = Math.round(target.x - Camera.X);
    Camera.OFFSET_Y = Math.round(target.y - Camera.Y);

    this.position.x = this.position.x  + ((target.x - Canvas.WIDTH / 2) - this.position.x) * this.scrollSpeed;
    this.position.y = this.position.y  + ((target.y - Canvas.HEIGHT / 2) - this.position.y) * this.scrollSpeed;

    this.position.x = Math2.clamp(this.position.x, 0, this.map.width -  Canvas.WIDTH);
    this.position.y = Math2.clamp(this.position.y, 0, this.map.height - Canvas.HEIGHT);

    context.translate(-this.position.x, -this.position.y);

    Camera.X = this.position.x;
    Camera.Y = this.position.y;
  }

  public static inViewPort(x: number, y: number): boolean {
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