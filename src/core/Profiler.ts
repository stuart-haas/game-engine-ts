export class Profiler {

  public static FPS:number = 0;

  private static instance:Profiler;

  public static getInstance() {
    if(!Profiler.instance) {
      Profiler.instance = new Profiler();
    }
    return Profiler.instance;
  }

  public update():void {
    document.getElementById('fps').getElementsByClassName("value")[0].innerHTML = Profiler.FPS.toString();
  }
}