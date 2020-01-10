export var context:CanvasRenderingContext2D;

export class Canvas {

  public static HEIGHT:number;
  public static WIDTH:number;

  public static initialize(elementId?:string):HTMLCanvasElement {
    var canvas:HTMLCanvasElement;

    if(elementId !== undefined) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement;
      if(canvas == undefined) {
        throw new Error("Cannot find a canvas element named " + elementId);
      }
    } else {
      canvas = document.createElement("canvas") as HTMLCanvasElement;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      document.body.appendChild(canvas);
    }

    context = canvas.getContext("2d");

    return canvas;
  }
}