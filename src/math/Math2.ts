export class Math2 {

  public static random():number {
    if (arguments.length > 2) {
      return 0;
    }
    switch (arguments.length) {
      case 0:
        return Math.random();
      case 1:
        return Math.round(Math.random() * arguments[0]);
      case 2:
        var min = arguments[0];
        var max = arguments[1];
        return Math.round(Math.random() * (max - min) + min);
    }
  }

  public static clamp(value:number, min:number, max:number):number {
    if (value >= max) return value = max;
    else if (value <= min) return value = min;
    else return value;
  }
}