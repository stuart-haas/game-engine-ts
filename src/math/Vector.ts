export class Vector {

  public x: number = 0;
  public y: number = 0;

  constructor(x ? : number, y ? : number) {
    this.x = x || 0;
    this.y = y || 0;
  }

  public add(vector: Vector): Vector {
    this.x += vector.x;
    this.y += vector.y;
    return this;
  }

  public subtract(vector: Vector): Vector {
    this.x -= vector.x
    this.y -= vector.y;
    return this;
  }

  public multiply(value: number): Vector {
    return new Vector(this.x *= value, this.y *= value);
  }

  public divide(value: number): Vector {
    return new Vector(this.x /= value, this.y /= value);
  }

  public dist(vector: Vector): number {
    var dx = vector.x - this.x;
    var dy = vector.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public distSq(vector: Vector): number {
    var dx = vector.x - this.x;
    var dy = vector.y - this.y;
    return dx * dx + dy * dy;
  }

  public normalize(): Vector {
    if (this.getLength() != 0) {
      this.x /= this.getLength();
      this.y /= this.getLength();
    }
    return this;
  }

  public getLength(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public getAngle(): number {
    return Math.atan2(this.y, this.x);
  }

  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  public static fromAngle(angle: number, magnitude: number): Vector {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  public static findInRadius(source: Vector, radius: number, step: number = 4, offset: Vector = new Vector()): Vector[] {
    var points:Vector[] = [];
    var x = source.x + offset.x;
    var y = source.y + offset.y;

    for(var j = x - radius; j <= x + radius; j += step) {
      for(var k = y - radius; k <= y + radius; k += step) {
        if(new Vector(j, k).dist(new Vector(x, y)) <= radius) {
          points.push(new Vector(j, k));
        }
      }
    }
    return points;
  }
}