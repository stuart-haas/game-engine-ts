import { Vector } from '@math/Vector';

export class Shape {

  public static circle(context: CanvasRenderingContext2D, position: Vector, radius: number, color: string): void {
    context.fillStyle = color;
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  public static rectangle(context: CanvasRenderingContext2D, position: Vector, width: number, height: number, color: string): void {
    context.fillStyle = color;
    context.beginPath();
    context.rect(position.x, position.y, width, height);
    context.closePath();
    context.fill();
  }
}