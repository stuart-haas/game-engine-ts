export class Vector {

  public x: number = 0;
  public y: number = 0;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
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
    if (this.length != 0) {
      this.x /= this.length;
      this.y /= this.length;
    }
    return this;
  }

  public clone(): Vector {
    return new Vector(this.x, this.y);
  }

  public get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  public static fromAngle(angle: number, magnitude: number): Vector {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  public static pointsInRadius(source: Vector, radius: number, step: number = 4, offset: Vector = new Vector()): Vector[] {
    var points:Vector[] = [];
    var x = Math.round(source.x + offset.x);
    var y = Math.round(source.y + offset.y);

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