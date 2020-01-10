import { Vector } from '@math/Vector';
import { LayerId } from '@map/Graph';

export enum Types{
  Path = 0,
  Collider = 1
}

export class Entity {

  public targets:Vector[] = [];
  public position:Vector;
  public velocity:Vector;
  public acceleration:Vector;
  public maxAcceleration:number;
  public maxVelocity:number;
  public mass:number;
  public friction:number;
  public size:number;
  public color:string;
  public layer:LayerId;
  public index:number;

  constructor(position:Vector = new Vector(), maxAcceleration:number = .25, maxVelocity:number = 1, mass:number = 100, friction:number = .95, size:number = 32, color:string = '#000') {
    this.position = position;
    this.maxAcceleration = maxAcceleration;
    this.maxVelocity = maxVelocity;
    this.mass = mass;
    this.friction = friction;
    this.size = size;
    this.color = color;
    this.velocity = new Vector();
    this.acceleration = new Vector();
  }

  public addTarget(target:Vector):void {  
    this.targets.push(target);
  }

  public update():void {
    this.velocity.add(this.acceleration);
    this.velocity.multiply(this.friction);
    this.acceleration.divide(this.mass);
    this.position.add(this.velocity);
  }

  public render():void {};
}