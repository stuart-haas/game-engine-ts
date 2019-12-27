import { Shape } from '@render/Shape';
import { Map } from '@core/Map';
import { Node } from '@entity/Node';
import { Types } from '@entity/Entity';

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

  public get nx(): number {
    if(this.length !== 0) {
      return this.x / this.length;
    }
    return 0.001;
  }

  public get ny(): number {
    if(this.length !== 0) {
      return this.y / this.length;
    }
    return 0.001;
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

  public static lineOfSight(map: Map, source: Vector, target: Vector, steps: number = 16, offset: Vector = new Vector(16, 16)): boolean {
    var source:Vector = new Vector(source.x + offset.x, source.y + offset.y);
    var target:Vector = new Vector(target.x + offset.x, target.y + offset.y);
    var diff:Vector = target.clone().subtract(source);
    var numberOfPoints:number = diff.length / steps;

    for(var i = 0; i < numberOfPoints; i ++) {
      var length = steps * i;
      var px:number = target.x + diff.nx * -length;
      var py:number = target.y + diff.ny * -length;
      Shape.circle(new Vector(px, py), 2, 'blue');

      var node:Node = map.nodeByVector(px, py);
      if(node.type == Types.Collider) {
        return false;
      }
    }

    return true;
  }
}