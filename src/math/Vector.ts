export class Vector{

  public x:number = 0;
  public y:number = 0;

  constructor(x?: number, y?: number) {
      this.x = x || 0;
      this.y = y || 0;
  }

  add(vector: Vector): Vector {
      this.x += vector.x;
      this.y += vector.y;
      return this;
  }

  subtract(vector: Vector): Vector {
      this.x -= vector.x
      this.y -= vector.y;
      return this;
  }

  multiply(value: number): Vector {
      return new Vector(this.x *= value, this.y *= value);
  }

  divide(value: number): Vector {
      return new Vector(this.x /= value, this.y /= value);
  }

  distSq(vector: Vector): number {
  var dx = vector.x - this.x;
  var dy = vector.y - this.y;
  return dx * dx + dy * dy;
}

  normalize(): Vector {
  if (this.getLength() != 0){
    this.x /= this.getLength();
    this.y /= this.getLength();
  }
  return this;
}
  
  getLength(): number {
      return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  getAngle(): number {
      return Math.atan2(this.y, this.x);
  }

  clone(): Vector {
      return new Vector(this.x, this.y);
  }

  static fromAngle(angle: number, magnitude: number): Vector {
      return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }
}