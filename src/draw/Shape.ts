import { Vector } from '@math/Vector';
import { context } from '@core/Canvas';

export class Shape {

  public static circle(position:Vector, radius:number, color:string):void {
    context.fillStyle = color;
    context.beginPath();
    context.arc(position.x, position.y, radius, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  }

  public static rectangle(position:Vector, width:number, height:number, color:string):void {
    context.fillStyle = color;
    context.beginPath();
    context.rect(position.x, position.y, width, height);
    context.closePath();
    context.fill();
  }

  public static line(start:Vector, end:Vector):void {
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }
}