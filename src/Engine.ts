import { gl, Canvas } from "Canvas";

export class Engine {

  private count:number = 0;
  private canvas: HTMLCanvasElement;

  public constructor() {

  }

  public start():void {

    this.canvas = Canvas.initialize();

    gl.clearColor(0, 0, 0, 1);

    this.loop();
  }

  public loop():void {

    gl.clear(gl.COLOR_BUFFER_BIT);
    
    requestAnimationFrame(this.loop.bind(this));
  }

  public resize():void {
    if(this.canvas !== undefined) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.outerHeight;
    }
  }
}