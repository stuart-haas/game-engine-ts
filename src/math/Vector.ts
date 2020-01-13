import { Shape } from '@draw/Shape';
import { Map } from '@core/Map';
import { Node } from '@entity/Node';
import { Layer } from '@core/Map';
import { Collision } from '@physics/Collision';
import { Entity } from '../entity/Entity';

export class Vector {

  public static DEG_TO_RAD:number = Math.PI / 180;
	public static RAD_TO_DEG:number = 180 / Math.PI;

  private _x:number = 0;
  private _y:number = 0;

  constructor(x:number = 0, y:number = 0) {
    this._x = x;
    this._y = y;
  }

  public add(vector:Vector):Vector {
    this._x += vector._x;
    this._y += vector._y;
    return this;
  }

  public subtract(vector:Vector):Vector {
    this._x -= vector._x
    this._y -= vector._y;
    return this;
  }

  public multiply(value:number):Vector {
    return new Vector(this._x *= value, this._y *= value);
  }

  public divide(value:number):Vector {
    return new Vector(this._x /= value, this._y /= value);
  }

  public dist(vector:Vector):number {
    var dx = vector._x - this._x;
    var dy = vector._y - this._y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public distSq(vector:Vector):number {
    var dx = vector._x - this._x;
    var dy = vector._y - this._y;
    return dx * dx + dy * dy;
  }

  public normalize():Vector {
    if (this.length != 0) {
      this._x /= this.length;
      this._y /= this.length;
    }
    return this;
  }

  public reverse():Vector {
    this._x -= this._x;
    this._y -= this._y;
    return this;
  }
  
  public truncate(max:number):Vector {
    if(this.length > max) {
      this.normalize();
      return this.multiply(max);
    }
    return this;
  }

  public equals(vector:Vector):boolean {
    return this.x == vector.x && this.y == vector.y;
  }

  public clone():Vector {
    return new Vector(this._x, this._y);
  }

  public set x(value:number) {
    this._x = value;
  }

  public get x():number {
    return Math.round(this._x);
  }

  public set y(value:number) {
    this._y = value;
  }

  public get y():number {
    return Math.round(this._y);
  }

  public get length():number {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  public get angle():number {
    return Math.atan2(this._y, this._x);
  }

  public get nx():number {
    if(this.length !== 0) {
      return this._x / this.length;
    }
    return 0.001;
  }

  public get ny():number {
    if(this.length !== 0) {
      return this._y / this.length;
    }
    return 0.001;
  }

  public setDirection(value:number):Vector {
    var angle:number = this.angle;
    this.x = Math.cos(angle) * value;
    this.y = Math.sin(angle) * value;
    return this;
  }

  public setAngle(value:number):Vector {
    var length:number = this.length;
    this.x = Math.cos(value) * length;
    this.y = Math.sin(value) * length;
    return this;
  }

  public static fromAngle(angle:number, magnitude:number):Vector {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  public static pointsInRadius(origin:Vector, radius:number, step:number = 4, offset:Vector = new Vector()):Vector[] {
    var points:Vector[] = [];
    var x = Math.round(origin._x + offset._x);
    var y = Math.round(origin._y + offset._y);

    for(var j = x - radius; j <= x + radius; j += step) {
      for(var k = y - radius; k <= y + radius; k += step) {
        if(new Vector(j, k).dist(new Vector(x, y)) <= radius) {
          points.push(new Vector(j, k));
        }
      }
    }
    return points;
  }

  public static lineOfSight(origin:Vector, target:Vector, layer:Layer, debug:boolean = false, steps:number = 16, offset:Vector = new Vector(16, 16)):boolean {
    var origin:Vector = new Vector(origin._x + offset._x, origin._y + offset._y);
    var target:Vector = new Vector(target._x + offset._x, target._y + offset._y);
    var diff:Vector = target.clone().subtract(origin);
    var numberOfPoints:number = diff.length / steps;

    for(var i = 0; i < numberOfPoints; i ++) {
      var length = steps * i;
      var px:number = target._x + diff.nx * -length;
      var py:number = target._y + diff.ny * -length;

      if(debug) {
        Shape.circle(new Vector(px, py), 2, 'blue');
      }

      var node:Node = Map.instance.nodeFromWorldPoint(new Vector(px, py), layer);

      if(node !== undefined) {
        if(node.index > layer) {
          return false;
        }
      }
    }
    return true;
  }

  public static seek(origin:Vector, target:Vector, maxVelocity:number):Vector {
    return target.clone().subtract(origin).normalize().multiply(maxVelocity);
  }

  public static flee(origin:Vector, target:Vector, maxVelocity:number):Vector {
    return origin.clone().subtract(target).normalize().multiply(maxVelocity);
  }

  public static arrive(origin:Vector, target:Vector, maxVelocity:number, arriveThreshold:number):Vector {
    var vector:Vector = target.clone().subtract(origin);
    if(vector.length < arriveThreshold) {
      vector = vector.normalize().multiply(maxVelocity).multiply(this.length / arriveThreshold);
    } else {
      vector = vector.normalize().multiply(maxVelocity);
    }
    return vector;
  }

  public static evade(origin:Vector, targetPosition:Vector, targetVelocity:Vector, maxVelocity:number, fleeThreshold:number):Vector {
    var lookAheadTime:number = origin.clone().subtract(targetPosition).length / maxVelocity;
    var predictedTarget:Vector = targetPosition.clone().add(targetVelocity.clone().multiply(lookAheadTime));
    return Vector.flee(origin, predictedTarget, fleeThreshold);
  }

  public static pursue(origin:Vector, targetPosition:Vector, targetVelocity:Vector, maxVelocity:number, seekThreshold:number):Vector {
    var lookAheadTime:number = origin.clone().subtract(targetPosition).length / maxVelocity;
    var predictedTarget:Vector = targetPosition.clone().add(targetVelocity.clone().multiply(lookAheadTime));
    return Vector.seek(origin, predictedTarget, seekThreshold);
  }

  public static avoid(origin:Vector, originVelocity:Vector, maxVelocity:number, maxLookAhead:number, maxAvoidanceForce:number):Vector {
    var origin:Vector = new Vector(origin.x + 16, origin.y + 16);
    var velocity:Vector = originVelocity.clone();
    var target:Vector = origin.clone().add(Vector.fromAngle(velocity.angle, maxLookAhead));
    Collision.intersects(origin, Layer.Collision, function(node) {
      return Vector.evade(target, node.position, velocity, maxVelocity, maxAvoidanceForce);
    });
    return new Vector();
  }

  public static wander(originVelocity:Vector, wanderDistance:number, wanderRadius:number, wanderRange:number) {
    var wanderAngle:number = Math.random() * wanderRange - wanderRange * .5;
    var center:Vector = originVelocity.clone().normalize().multiply(wanderDistance);
    var offset:Vector = new Vector();
    offset.setDirection(wanderRadius);
    offset.setAngle(wanderAngle);
    return center.add(offset);
  }
}