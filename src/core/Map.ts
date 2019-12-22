import { Camera } from './Camera';

export class Map {

  public static WIDTH:number = 2000;
  public static HEIGHT:number = 1000;

  public constructor() {
    
  }

  public generate(context: CanvasRenderingContext2D): void {
    var rows = ~~(Map.WIDTH / 32) + 1;
    var columns = ~~(Map.HEIGHT / 32) + 1;
    
    var color = "red";
    context.fillStyle = "red";
    for (var x = 0, i = 0; i < rows; x += 32, i++) {
      context.beginPath();
      for (var y = 0, j = 0; j < columns; y += 32, j++) {
        if(Camera.in_viewport(x, y)) {
          context.rect(x, y, 30, 30);
        }
      }
      color = (color == "red" ? "blue" : "red");
      context.fillStyle = color;
      context.fill();
      context.closePath();
    }
  }
}