import { Vector } from '@math/Vector';
import { Mathf } from '@math/Mathf';
import { Map } from './Map';
import { Canvas, context } from './Canvas';

export class Camera {

  public static OFFSET_X:number;
  public static OFFSET_Y:number;
  public static X:number;
  public static Y:number;

  public position:Vector;

  private target:Vector;
  private scrollSpeed:number;

  public static instance:Camera;

  public static createInstance(target?:Vector, scrollSpeed?:number) {
    if(!Camera.instance) {
      Camera.instance = new Camera(target, scrollSpeed);
    }
    return Camera.instance;
  }

  public constructor(target:Vector = new Vector(), scrollSpeed:number = 5) {
    this.position = new Vector();
    this.target = target;
    this.scrollSpeed = scrollSpeed;
  }

  public setTarget(target:Vector):void {
    this.target = target;
  }

  public update(delta:number):void {
    
    Camera.OFFSET_X = Math.round(this.target.x - Camera.X);
    Camera.OFFSET_Y = Math.round(this.target.y - Camera.Y);

    this.position.x = this.position.x + ((this.target.x - Canvas.WIDTH / 2) - this.position.x) * this.scrollSpeed * delta;
    this.position.y = this.position.y + ((this.target.y - Canvas.HEIGHT / 2) - this.position.y) * this.scrollSpeed * delta;

    this.position.x = Mathf.clamp(this.position.x, 0, Map.instance.width -  Canvas.WIDTH);
    this.position.y = Mathf.clamp(this.position.y, 0, Map.instance.height - Canvas.HEIGHT);

    context.translate(-this.position.x, -this.position.y);

    Camera.X = this.position.x;
    Camera.Y = this.position.y;
  }

  public static inViewPort(x:number, y:number):boolean {
    if(
      x < Camera.OFFSET_X - Canvas.WIDTH ||
      x > Camera.X + Canvas.WIDTH ||
      y < Camera.OFFSET_Y - Canvas.HEIGHT ||
      y > Camera.Y + Canvas.HEIGHT
    ) {
      return false;
    }
    return true;
  }
}