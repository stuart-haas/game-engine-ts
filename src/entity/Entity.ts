import { Vector } from '@math/Vector';
import { LayerId } from '@core/Map';

export enum Types{
  Path = 0,
  Collider = 1
}

export class Entity {

  public targets:Entity[] = [];
  public path:Vector[] = [];
  public position:Vector;
  public velocity:Vector;
  public acceleration:Vector;
  public maxAcceleration:number;
  public maxVelocity:number;
  public maxSpeed:number;
  public mass:number;
  public friction:number;
  public size:number;
  public color:string;
  public layer:LayerId;
  public index:number;

  constructor(position:Vector = new Vector(), maxAcceleration:number = 1, maxVelocity:number = 5, maxSpeed:number = 5, mass:number = 100, friction:number = .98, size:number = 32, color:string = '#000') {
    this.position = position;
    this.maxAcceleration = maxAcceleration;
    this.maxVelocity = maxVelocity;
    this.maxSpeed = maxSpeed;
    this.mass = mass;
    this.friction = friction;
    this.size = size;
    this.color = color;
    this.velocity = new Vector();
    this.acceleration = new Vector();
  }

  public addTarget(target:Entity):void {  
    this.targets.push(target);
  }

  public update():void {
    this.acceleration.subtract(this.velocity).truncate(this.maxAcceleration).divide(this.mass);
    this.velocity.add(this.acceleration).multiply(this.friction).truncate(this.maxSpeed);
    this.position.add(this.velocity);
  }

  public render():void {};
}