export var gl: WebGLRenderingContext;

export class Canvas {

  /**
   * Initialize WebGL, potentially using the canvas
   * @param elementId 
   */
  public static initialize(elementId?: string): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;

    if(elementId !== undefined) {
      canvas = document.getElementById(elementId) as HTMLCanvasElement;
      if(canvas == undefined) {
        throw new Error("Cannot find a canvas element named " + elementId);
      }
    } else {
      canvas = document.createElement("canvas") as HTMLCanvasElement;
      document.body.appendChild(canvas);
    }

    gl = canvas.getContext("webgl");
    if(gl == undefined) {
      throw new Error("Unable to initialize WebGL!");
    }

    return canvas;
  }
}