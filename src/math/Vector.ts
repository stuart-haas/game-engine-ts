import { Shape } from '@render/Shape';
import { Graph } from 'map/Graph';
import { Node } from '@entity/Node';
import { Layer } from '@map/Graph';

export class Vector {

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

  public static fromAngle(angle:number, magnitude:number):Vector {
    return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
  }

  public static pointsInRadius(source:Vector, radius:number, step:number = 4, offset:Vector = new Vector()):Vector[] {
    var points:Vector[] = [];
    var x = Math.round(source._x + offset._x);
    var y = Math.round(source._y + offset._y);

    for(var j = x - radius; j <= x + radius; j += step) {
      for(var k = y - radius; k <= y + radius; k += step) {
        if(new Vector(j, k).dist(new Vector(x, y)) <= radius) {
          points.push(new Vector(j, k));
        }
      }
    }
    return points;
  }

  public static lineOfSight(graph:Graph, source:Vector, target:Vector, layer:Layer, steps:number = 16, offset:Vector = new Vector(16, 16)):boolean {
    var source:Vector = new Vector(source._x + offset._x, source._y + offset._y);
    var target:Vector = new Vector(target._x + offset._x, target._y + offset._y);
    var diff:Vector = target.clone().subtract(source);
    var numberOfPoints:number = diff.length / steps;

    for(var i = 0; i < numberOfPoints; i ++) {
      var length = steps * i;
      var px:number = target._x + diff.nx * -length;
      var py:number = target._y + diff.ny * -length;
      Shape.circle(new Vector(px, py), 2, 'blue');

      var node:Node = graph.nodeFromWorldPoint(new Vector(px, py), layer);
      if(node.layer == layer) {
        return false;
      }
    }

    return true;
  }
}